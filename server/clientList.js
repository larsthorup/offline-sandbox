const socketEngine = require('engine.io');

class ClientList {
  static connect (httpServer) {
    return new ClientList(httpServer);
  }

  constructor (httpServer) {
    this.socketSet = {};
    const socketServer = socketEngine.Server();
    socketServer.attach(httpServer);
    socketServer.on('connection', socket => {
      console.log('socket connected', socket.id);
      socket.on('message', async data => {
        if (data === 'authToken') {
          this.socketSet[socket.id] = socket;
          this.notify({channel: 'auth', data: 'authorized', socket});
        } else {
          this.notify({channel: 'auth', data: 'not authorized', socket});
        }
      });
      socket.on('close', () => {
        delete this.socketSet[socket.id];
        console.log('socket closed', socket.id);
      });
    });
  }

  notify ({channel, data, socket}) {
    socket.send(JSON.stringify({channel, data}));
  }

  notifyAll ({channel, data}) {
    for (const socket of Object.values(this.socketSet)) {
      this.notify({channel, data, socket});
    }
  }
}

module.exports = ClientList;
