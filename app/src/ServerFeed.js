import reconnect from 'engine.io-reconnect';
import eio from 'engine.io-client';

class ChannelFeed {
  constructor (channel) {
    this.channel = channel;
  }

  on (event, handler) {
    if (event !== 'data') throw new Error(`Invalid event in ChannelFeed.on(): "${event}"`);
    this.handler = handler;
  }

  emit (data) {
    const handler = this.handler;
    if (handler) {
      handler(data);
    }
  }
}

// ToDo: tests
class ServerFeed {
  constructor () {
    this.feedListByChannel = {};
    this.setDisconnected();
  }

  setDisconnected () {
    this.connectedStatus = 'disconnected';
    this.notifyingConnectedStatus({});
  }

  setConnected () {
    this.connectedStatus = 'connected';
    this.notifyingConnectedStatus({});
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
      this.notifying(message);
    });
  }

  subscribe (channel, handler) {
    if (!channel) throw new Error('ServerFeed.subscribe(): missing channel')
    const feed = new ChannelFeed(channel);
    if (handler) {
      feed.on('data', handler);
    }
    this.feedListByChannel[channel] = this.feedListByChannel[channel] || [];
    this.feedListByChannel[channel].push(feed);
    if (channel === 'connection') {
      this.notifyingConnectedStatus({feed});
    }
    return feed;
  }

  unsubscribe (feed) {
    if (!feed) return;
    const channel = feed.channel;
    if (!this.feedListByChannel[channel]) return;
    this.feedListByChannel[channel] = this.feedListByChannel.filter(el => el !== feed);
  }

  notifying ({channel, feed, data}) {
    if (feed) {
      // console.log({channel, data})
      feed.emit(data)
    } else {
      const feedList = this.feedListByChannel[channel];
      if (feedList) for (feed of feedList) {
        this.notifying({channel, feed, data});
      }
    }
  }

  notifyingConnectedStatus ({feed}) {
    this.notifying({
      channel: 'connection',
      feed,
      data: this.connectedStatus
    });
  }
}

const serverFeed = new ServerFeed();
export default serverFeed;