require('dotenv').config();

const socketEngine = require('engine.io');
const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

// console.log('process.env.DATABASE', process.env.DATABASE);
const db = pgp(process.env.DATABASE);
const port = 3001; // Note: must match port of the "proxy" URL in app/package.json

const app = express();
app.use(bodyParser.json());

app.use(express.static('app')); // Note: serve app as static assets
app.get("/", function (request, response) { // Note: redirect root URL to index.html in app
  response.sendFile(__dirname + '/app/index.html');
});

async function dreamsGetHandler (request, response) {
  const rowList = await db.query('select * from dream');
  const dreamSet = {};
  for (const row of rowList) {
    dreamSet[row.id] = row;
  }
  response.send(dreamSet);
}
app.get("/api/dreams", dreamsGetHandler);

async function dreamPostHandler (request, response) {
  const id = await db.one('insert into dream (title) values ($1) returning id', [
    request.body.title
  ]);
  response.send({id});
}
app.post("/api/dream", dreamPostHandler);

function listeningHandler () {
  console.log(`Server is listening on port ${port}`);
}
const httpServer = app.listen(port, listeningHandler);

async function main () {
  const dbNotify = await db.connect({direct: true}); // ToDo: onLost: onConnectionLost
  const dreamChannel = 'dream';
  await dbNotify.none('listen $1~', dreamChannel);

  // ToDo: extract
  const socketServer = socketEngine.Server();
  socketServer.attach(httpServer);
  socketServer.on('connection', socket => {
    let intervalHandle;
    console.log('socket connected', socket.id);
    socket.on('message', async data => {
      if (data === 'authToken') {
        socket.send(JSON.stringify({channel: 'auth', data: 'authorized'}));

        // ToDo: extract
        intervalHandle = setInterval(() => {
          socket.send(JSON.stringify({channel: 'time', data: new Date().toISOString()}));
        }, 5000);

        // ToDo: extract
        dbNotify.client.on('notification', data => { // ToDo: single event handler, not one per client connection!!
          console.log('notification', data)
          if (data.channel === dreamChannel) {
            socket.send(JSON.stringify({channel: dreamChannel, data: JSON.parse(data.payload)}));
          }
        });

      } else {
        socket.send(JSON.stringify({channel: 'auth', data: 'not authorized'}));
      }
    });
    socket.on('close', () => {
      if (intervalHandle) clearInterval(intervalHandle);
      console.log('socket closed', socket.id);
    });
  });
}

main().catch(console.error);