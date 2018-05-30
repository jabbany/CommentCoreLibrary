import { StageElement, IScripter, ISandbox, IScriptingContext, IPlayer } from "./IScripter.ts";
import { OOAPIMessage, LogMessage } from './OOAPI.d.ts';

import { OOAPIWorker } from './OOAPIWorker.ts';
import { KagerouScripting } from './ScriptingContext.ts';
import { SmartQueue, UpdateItem } from './Queue/SmartQueue.ts';

interface SandboxEvent extends UpdateItem {

}

export class BridgedSandbox implements ISandbox {
  private _scripter:IScripter;
  private _scriptingContext:IScriptingContext;
  private _stage:StageElement;
  private _player:IPlayer;
  private _worker:OOAPIWorker;
  private _queue:SmartQueue<SandboxEvent>;

  private _isAvailable:boolean = false;

  constructor(scripter:IScripter, stage:StageElement, player:IPlayer) {
    this._scripter = scripter;
    this._scriptingContext = KagerouScripting.getContext(stage);
    this._stage = stage;
    this._player = player;
    this._worker = new OOAPIWorker(this._scripter.getWorker());
    this._queue = new SmartQueue<SandboxEvent>();

    this._bind();
  }

  get isAvailable():boolean {
    return this._isAvailable;
  }

  set isAvailable(b:boolean) {
    throw new Error('BridgedSandbox.isAvailable is read-only');
  }

  private _getDimensionsMessage():OOAPIMessage {
    return {
      'channel': 'Update:DimensionUpdate',
      'payload': {
        'stageWidth':this._stage.offsetWidth,
				'stageHeight':this._stage.offsetHeight,
				'screenWidth':window.screen.width,
				'screenHeight':window.screen.height
      }
    };
  }

  private _bind():void {
    // Handle all malformed packets by throwing them into the logger
    this._worker.setMalformedEventHandler(((e) => {
      if (e.stack) {
        this._scripter.logger.error(e.stack);
      } else {
        this._scripter.logger.error(e);
      }
    }).bind(this));

    // Add the default listener to catch all messages that are not caught and
    // throw them into the logger
    this._worker.setDefaultChannelListener(((m:OOAPIMessage) => {
      this._scripter.logger.warn('Got message for non-existant channel "' +
        m.channel + '".');
    }).bind(this));


    // Add a channel for logging
    this._worker.addChannelListener('', ((m:OOAPIMessage) => {
      // Log message
      var message:LogMessage = m as LogMessage;
      switch (message.mode) {
        case 'log':
        default:
          this._scripter.logger.log(message.obj);
          break;
        case 'warn':
          this._scripter.logger.warn(message.obj);
          break;
        case 'err':
          this._scripter.logger.error(message.obj);
          break;
        case 'fatal':
          this._scripter.logger.error(message.obj);
          this.reset();
          break;
      }
    }).bind(this));

    // Add a channel to acquire worker state info
    this._worker.addChannelListener('::worker:state', ((m:OOAPIMessage) => {
      if (m.auth === 'worker' && m.payload === 'running') {
        if (!this._isAvailable) {
          this._isAvailable = true;
          this.init();
        }
      }
    }));

    // Add a channel to debug the worker
    this._worker.addChannelListener('::worker:debug', ((m:OOAPIMessage) => {
      this._scripter.logger.log(JSON.stringify(m.payload));
    }));
  }

  private init():void {
    this._worker.send(this._getDimensionsMessage());
    // Actually do the bindings
  }

  public eval(code:string):void {
    if (!this._isAvailable) {
      throw new Error('Worker not available yet!');
    }
    this._worker.send({
      'channel': '::eval',
      'payload': code
    });
  }

  public reset():void {
    this._isAvailable = false;
    try {
      this._worker.terminate();
    } catch(e) {
      this._scripter.logger.error(e);
    }
    this._queue.clear();

    // Empty any remnants in the scripting context
    this._scriptingContext.reset();
    // Reset the current worker
    this._worker = new OOAPIWorker(this._scripter.getWorker());
    this._bind();
  }
}
