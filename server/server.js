require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const pgp = require('pg-promise')();

const ClientList = require('./clientList');

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
const clientList = ClientList.connect(httpServer);

setInterval(() => {
  clientList.notifyAll({channel: 'time', data: {time: new Date().toISOString()}});
}, 5000);

async function listenDb () {
  const dbNotify = await db.connect({direct: true}); // ToDo: onLost: onConnectionLost
  const dreamChannel = 'dream:inserted';
  await dbNotify.none('listen $1~', dreamChannel);
  dbNotify.client.on('notification', data => {
    if (data.channel === dreamChannel) {
      clientList.notifyAll({channel: dreamChannel, data: JSON.parse(data.payload)});
    }
  });
}

listenDb().catch(console.error);