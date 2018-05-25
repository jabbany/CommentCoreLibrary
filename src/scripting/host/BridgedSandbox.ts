import { StageElement, IScripter, ISandbox, IScriptingContext, IPlayer } from "./IScripter.ts";
import { OOAPIMessage } from './OOAPI.d.ts';

import { OOAPIWorker } from './OOAPIWorker.ts';
import { KagerouScripting } from "./ScriptingContext.ts";

interface UpdateItem {
  /**
   * The "class" that this UpdateItem is in. Items of the same class may
   * override each other.
   */
  group:string;
  /**
   * Boolean value indicating whether to allow future items to override this one
   */
  allowOverride:boolean;
  /**
   * Boolean value indicating whether the current item will trigger an override
   */
  triggerOverride:boolean;
}

interface SandboxEvent extends UpdateItem {

}

/**
 * Smart queue that can combine items that "override" earlier ones by removing
 * earlier occurrances of the item
 * @author Jim Chen
 */
class SmartQueue<T extends UpdateItem> {
  private _groups:{[groupName:string]: T[]} = {};
  public items:T[] = [];

  private prune(groupName:string):void {
    // Remove all the items in group that allow override
    if (groupName in this._groups) {
      for (var i = 0; i < this.items.length; i++) {
        if (this.items[i].group === groupName) {
          if (this.items[i].allowOverride) {
            // Remove from both _groups and main list
            if (this.items[i] !== this._groups[groupName].shift()) {
              throw new Error('SmartQueue desynchronized. Expected ' +
                this.items[i]);
            }
            this.items.splice(i, 1);
            i--;
            // Continue the loop but since we removed this element,
            // we look at this element's index again,
          }
        }
      }
    }
  }

  public enqueue(item:T):void {
    if (item.triggerOverride) {
      this.prune(item.group);
    }
    this.items.push(item);
    if (!(item.group in this._groups)) {
      this._groups[item.group] = [];
    }
    this._groups[item.group].push(item);
  }

  public dequeue():T {
    // Get the item from the list
    var item:T = this.items.shift();
    // Also remove it from its group and do a sanity check
    if (this._groups[item.group].shift() !== item) {
      throw new Error('SmartQueue desynchronized. Expected ' + item);
    }
    return item;
  }

  public clear():void {
    this._groups = {};
    this.items = [];
  }
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


    //
    this._worker.addChannelListener('', ((m:OOAPIMessage) => {
      // Log message
    }).bind(this));
  }

  public eval(code:string):void {
    if (!this._isAvailable) {
      throw new Error('Worker not available yet!');
    }
  }

  public reset():void {
    this._isAvailable = false;
    try {
      this._worker.terminate();
    } catch(e) { }
    this._queue.clear();

    // Empty any remnants in the scripting context
    this._scriptingContext.reset();
    // Reset the current worker
    this._worker = new OOAPIWorker(this._scripter.getWorker());
    this._bind();
  }
}
