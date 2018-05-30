import { OOAPIMessage } from './OOAPI.d.ts';

export type ChannelListener = (e:OOAPIMessage) => void;

class WorkerMessageError extends Error {
  public source:any = null;

  constructor(messageObject:Object) {
    super('Worker message malformed: ' + JSON.stringify(messageObject));
    this.source = messageObject;
  }
}

class NoHandlerError extends Error {
  public source:OOAPIMessage = null;

  constructor(message:OOAPIMessage) {
    super('Could not find handler for message on channel: ' + message.channel);
    this.source = message;
  }
}

export class OOAPIWorker {
  private _worker:Worker;
  private _malformedHandler:Function = null;
  private _defaultChannelListener:ChannelListener = null;
  private _channels:{[channelName:string] : ChannelListener[]} = {};

  constructor(worker:Worker) {
    this._worker = worker;
    worker.addEventListener('message', ((e:MessageEvent) => {
        var message;
        try {
          message = JSON.parse(e.data);
        } catch (e) {
          this._handleMalformed(e);
          return;
        }

        if (!(typeof message === 'object') || message === null) {
          this._handleMalformed(new WorkerMessageError(message));
          return;
        }
        if (!('channel' in message) || !('payload' in message) ||
          (typeof message['channel'] !== 'string')) {

          this._handleMalformed(new WorkerMessageError(message));
          return;
        }

        var apiMessage:OOAPIMessage = <OOAPIMessage> message;
        this._dispatchEvent(apiMessage.channel, message);

    }).bind(this));
  }

  private _handleMalformed(error:Error):void {
    if (typeof this._malformedHandler === 'function') {
      this._malformedHandler(error);
    } else {
      // Make it fatal
      throw error;
    }
  }

  private _dispatchEvent(channel:string, data:OOAPIMessage):void {
    if (channel in this._channels) {
      if (this._channels[channel].length === 0) {
        if (typeof this._defaultChannelListener === 'function') {
          this._defaultChannelListener(data);
        } else {
          throw new NoHandlerError(data);
        }
        return;
      }
      for (var i = 0; i < this._channels[channel].length; i++) {
        this._channels[channel][i](data);
      }
    } else {
      if (typeof this._defaultChannelListener === 'function') {
        this._defaultChannelListener(data);
      } else {
        throw new NoHandlerError(data);
      }
    }
  }

  public send(message:OOAPIMessage):void {
    this._worker.postMessage(JSON.stringify(message));
  }

  public setMalformedEventHandler(handler:Function):void {
    this._malformedHandler = handler;
  }

  public setDefaultChannelListener(listener:ChannelListener):void {
    this._defaultChannelListener = listener;
  }

  public addChannelListener(channel:string, listener:ChannelListener):void {
    if (!(channel in this._channels)) {
      this._channels[channel] = [];
    }
    this._channels[channel].push(listener);
  }

  public terminate():void {
    return this._worker.terminate();
  }
}
