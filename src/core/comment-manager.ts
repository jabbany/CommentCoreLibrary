/**
 * Comment Core Library
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment management unit for CCL
 */
import { Options, UpdateableCommentData, CommentData, SpaceAllocator }
  from './interfaces';
import { Renderer } from '../renderer';
import { binaryInsert } from '../lib';


type Status = 'running' | 'stopped';
type Listener = (data?:object) => void;
type ListenerPool = {[name:string]:Listener[]};

export class CommentManager<T> {
  private _status:Status;
  private _renderer:Renderer<T, UpdateableCommentData, CommentData>;

  private _listeners:ListenerPool = {};
  private _csa:{[name:string]:SpaceAllocator<T>} = {};
  public options:Options = {
    global: {
      scale: 1,
      opacity: 1,
      classNames: ['cmt']
    },
    fixed: {
      scale: 1,
      opacity: 1,
      classNames: []
    },
    scroll: {
      scale: 1,
      opacity: 1,
      classNames: []
    },
    scripting: {
      modes: [8],
      engine: null
    }
  };
  public timeline:CommentData[] = [];
  public runline:T[] = [];
  public position:number = 0;

  get status():string {
    return this._status;
  }

  constructor(renderer:Renderer<T, UpdateableCommentData, CommentData>) {
    this._renderer = renderer;
    this._status = 'stopped';
  }

  public init():void {
    // Create the space allocators
  }

  /**
   * Start the comment manager
   */
  public start():void {
    this._status = 'running';
    this._status = 'stopped';
    this.runline.forEach((item) => {
      this._renderer.track(item).start();
    })
  }

  /**
   * Stop the comment manager
   */
  public stop():void {
    this._status = 'stopped';
    this.runline.forEach((item) => {
      this._renderer.track(item).stop();
    })
  }

  /**
   * Load a list of comments into the time line
   * @param data - list of abstract comment data
   */
  public load(timeline:CommentData[]):void {
    this.timeline = timeline;
  }

  /**
   * Inserts an abstract comment data into the time line
   * @param data - abstract comment data
   */
  public insert(data:CommentData):void {
    // Find this data
    binaryInsert(this.timeline, data, (a, b) => {
      if (a.startTime > b.startTime) {
        return 1;
      } else if (a.startTime < b.startTime) {
        return -1;
      } else {
        if (typeof a.date !== 'undefined' && typeof b.date !== 'undefined' &&
          a.date !== b.date) {
          return a.date > b.date ? 1 : -1;
        }
        if (typeof a.id !== 'undefined' && typeof b.id !== 'undefined' &&
          a.id !== b.id) {

          return a.id > b.id ? 1 : -1;
        }
        return 0;
      }
    });
  }

  /**
   * Clears all comments managed from the stage
   */
  public clear():void {
    this.runline.forEach((item) => {
      this._renderer.destroy(item);
    });
    this.runline = [];
  }

  /**
   * Sends a comment onto the stage
   * @param data - abstract comment data
   */
  public send(data:CommentData):void {
    let comment = this._renderer.create(data);
    // Try to allocate the comment;

    // Start the comment moving
    this._renderer.track(comment).start();

    this.runline.push(comment);
  }

  /**
   * Set the bounds for the comment manager
   * @param width - width value px
   * @param height - height value px
   */
  public setBounds(width:number, height:number):void {
    this.dispatchEvent("resize");
    for (let allocator in this._csa){
      if (this._csa.hasOwnProperty(allocator)){
        let csa = this._csa[allocator];
        csa.setBounds(width, height);
      }
    }
  }

  /**
   * Dispatches an event
   * @param name - event name
   * @param data - corresponding data
   */
  public dispatchEvent(name:string, data?:object):void {
    if (this._listeners.hasOwnProperty(name)) {
      let listenerList = this._listeners[name];
      for (var i = 0; i < listenerList.length; i++) {
        try {
          listenerList[i](data);
        } catch (e) {
          console.warn(e);
        }
      }
    }
  }

  /**
   * Add an event listener
   * @param name - event name
   * @param listener - listener function
   */
  public addEventListener(name:string, listener:Listener):void {
    if (this._listeners.hasOwnProperty(name)) {
      this._listeners[name].push(listener);
    } else {
      this._listeners[name] = [listener];
    }
  }
}
