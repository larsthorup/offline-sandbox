import reconnect from 'engine.io-reconnect';
import eio from 'engine.io-client';
import EventEmitter from 'events';

// ToDo: tests
class ServerFeed extends EventEmitter {
  constructor () {
    super();
    this.setDisconnected();
  }

  setDisconnected () {
    this.connectedStatus = 'disconnected';
    this.emitConnectedStatus();
  }

  setConnected () {
    this.connectedStatus = 'connected';
    this.emitConnectedStatus();
  }

  async authenticating (token) {
    this.token = token;
    await this.sending(token);
  }

  async sending (message) {
    await this.opening();
    this.socket.send(message);
  }

  async opening () {
    if (this.socket) return;

    this.socket = new eio.Socket(); // Note: will connect back to originating host and port
    const reconnector = reconnect(this.socket, {
      timeout: false
    });
    reconnector.on('reconnect', async attemptCount => {
      console.log(`reconnected after ${attemptCount} attempts`);
      this.setConnected();
      await this.authenticating(this.token);
    });
    reconnector.on('reconnecting', attemptCount => {
      console.log(`reconnecting after ${attemptCount} attempts`);
    });
    reconnector.on('reconnect_error', error => {
      console.log(`failed to reconnect: ${error}`);
    });
    reconnector.on('reconnect_timeout', timeout => {
      console.log(`timeout after ${timeout}ms`);
    });

    await new Promise(resolve => this.socket.on('open', () => {
      this.setConnected();
      resolve();
    }));
    this.socket.on('close', () => {
      this.setDisconnected();
    });
    this.socket.on('message', json => {
      const message = JSON.parse(json);
      this.emit(message.channel, message.data);
    });
  }

  emitConnectedStatus () {
    this.emit('connection:status', {status: this.connectedStatus});
  }
}

const serverFeed = new ServerFeed();
export default serverFeed;