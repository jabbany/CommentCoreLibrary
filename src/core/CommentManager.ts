/**
 * Comment Manager for Comment Core Library
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment management unit for CCL
 */
import { IComment, ICommentData } from "./IComment.d";
import { ICommentManager, CCLOptions } from "./ICommentManager.d";

import { BinArray } from "./lib/BinArray";
import { TimeKeeper } from "./lib/TimeKeeper";
import { ISpaceAllocator, CommentSpaceAllocator, AnchorCommentSpaceAllocator }
  from "./CommentSpaceAllocator";
import { ICommentFactory, CommentFactory } from "./CommentFactory";

type Listener = (data?:any) => void;

export class CommentManager implements ICommentManager {
  private static DEFAULT_COMPARATOR:BinArray.Comparator =
    (a:ICommentData, b:ICommentData) => {
      if (a.stime !== b.stime) {
        return a.stime > b.stime ? 2 : -2;
      } else {
        if (a.hasOwnProperty('date') && b.hasOwnProperty('date') &&
          a.date !== b.date) {
            return a.date > b.date ? 1 : -1;
        } else if (a.hasOwnProperty('dbid') && b.hasOwnProperty('dbid')) {
          return a.dbid > b.dbid ? 1 : -1;
        }
      }
      return 0;
    };
  private _width:number = 0;
  private _height:number = 0;
  private _status:string = 'stopped';

  private _timeKeeper:TimeKeeper;
  private _stage:HTMLDivElement;
  private _listeners:{[name: string]:Array<Listener>} = {};
  private _csa:{[name:string]: ISpaceAllocator} = {};

  public options:CCLOptions = {
    "global": {
      "scale": 1,
      "opacity": 1,
      "className": "cmt"
    },
    "scroll": {
      "scale": 1,
      "opacity": 1
    },
    "scripting":{
      "mode": [8],
      "engine": null
    }
  };
  public timeline:Array<ICommentData> = [];
  public runline:Array<IComment> = [];
  public position:number = 0;
  public factory:ICommentFactory;

  constructor(stage:HTMLDivElement, config:Object = {}) {
    this._stage = stage;
    this._timeKeeper = new TimeKeeper('requestAnimationFrame');
    this._timeKeeper.addEventListener('time', ((elapsed:number) => {
      this._tick(elapsed);
      this._timeKeeper.reset();
    }).bind(this));
  }

  get width():number {
    return this._width;
  }

  get height():number {
    return this._height;
  }

  get stage():HTMLDivElement {
    return this._stage;
  }

  get status():string {
    return this._status;
  }

  set status(status:string) {
    if (status !== 'running' && status !== 'stopped') {
      throw new Error('Status must be one of running or stopped!');
    }
    if (status === this._status) {
      // Don't do anything, no change
      return;
    }
    if (this._status === 'running') {
      this.stop();
    } else {
      this.start();
    }
  }

  /**
   * Action to be performed every tick
   * @private
   **/
  private _tick(elapsed:number):void {
    this.runline.forEach((comment:IComment) => comment.time(elapsed));
  }

  /**
   * Finds associated {ISpaceAllocator} based on comment mode
   * @private
   * @param {number} mode - mode to look at
   * @returns {ISpaceAllocator} corresponding space allocator, or null if none exist
   */
  private _associateAllocator(mode:number):ISpaceAllocator {
    switch(mode) {
      case 1:
        return this._csa['scroll'];
      case 2:
        return this._csa['scroll-bottom'];
      case 4:
        return this._csa['bottom'];
      case 5:
        return this._csa['top'];
      case 6:
        return this._csa['reverse'];
      default:
        return null;
    }
  }

  public init(renderMode:string = 'css'):void {
    // Create the comment space allocators
    this._csa['scroll'] = new CommentSpaceAllocator(0, 0);
    this._csa['scroll-bottom'] = new CommentSpaceAllocator(0, 0);
    this._csa['top'] = new AnchorCommentSpaceAllocator(0, 0);
    this._csa['bottom'] = new AnchorCommentSpaceAllocator(0, 0);
    this._csa['reverse'] = new CommentSpaceAllocator(0, 0);

    // Update bounds
    this.setBounds();

    // Setup renderer
    switch(renderMode) {
      case 'legacy':
        this.factory = CommentFactory.defaultFactory();
        break;
      case 'svg':
        this.factory = CommentFactory.defaultSvgRenderFactory();
        break;
      case 'canvas':
        this.factory = CommentFactory.defaultCanvasRenderFactory();
        break;
      default:
      case 'css':
        this.factory = CommentFactory.defaultCssRenderFactory();
        break;
    }
  }

  /**
   * Start the comment manager
   */
  public start():void {
    this._status = 'running';
    this._timeKeeper.start();
  }

  /**
   * Stop the comment manager
   */
  public stop():void {
    this._status = 'stopped';
    this._timeKeeper.stop();
    // Go through the comment runline and stop stuff
    this.runline.forEach((cmt) => cmt.stop());
  }

  public seek(time:number):void {
    this.position = BinArray.bsearch(this.timeline, time,
      (a:number, b:ICommentData) => {
        if (a < b.stime) {
          return -1;
        } else if (a > b.stime) {
          return 1;
        }
        return 0;
      });
    return;
  }

  public time(time:number):void {

  }

  /**
   * Load a list of comments into the time line
   * @param {Array<ICommentData>} data - list of abstract comment data
   */
  public load(data:Array<ICommentData>):void {
    this.timeline = data.sort(CommentManager.DEFAULT_COMPARATOR);
    this.dispatchEvent('load');
  }

  /**
   * Inserts an abstract comment data into the time line
   * @param {ICommentData} data - abstract comment data
   */
  public insert(data:ICommentData):void {
    var index = BinArray.binsert(this.timeline,
      data,
      CommentManager.DEFAULT_COMPARATOR);
    if (index <= this.position) {
      this.position ++;
    }
    this.dispatchEvent('insert');
  }

  /**
   * Clears all comments managed from the stage
   */
  public clear():void {
    while(this.runline.length > 0){
      this.runline[0].finish();
    }
  }

  /**
   * Sends a comment onto the stage
   * @param {ICommentData} data - abstract comment data
   */
  public send(data:ICommentData):void {
    if (!data.hasOwnProperty('mode')) {
      data.mode = 1;
    }
    if (this.options.scripting.mode.indexOf(data.mode) >= 0) {
      // Handle scripting comments
      if (this.options.scripting.engine !== null) {
        this.options.scripting.engine.eval(data.code);
      } else {
        console.warn(
          'Tried to execute scripting comment but scripting engine not found');
      }
      return;
    }
    // Handle normal comments
    var comment:IComment = this.factory.create(this, data);

    // Add this to the correct comment space allocator
    var allocator:ISpaceAllocator = this._associateAllocator(data.mode);
    if (allocator !== null) {
      allocator.add(comment);
    }

    this.runline.push(comment);
    this.dispatchEvent('enterComment', comment);
  }

  /**
   * Set the bounds for the comment manager
   * @param {number} width - width value px, defaults to stage.offsetWidth
   * @param {number} height - height value px, defaults to stage.offsetHeight
   */
  public setBounds(
    width:number = this.stage.offsetWidth,
    height:number = this.stage.offsetHeight):void {

    this._width = width;
    this._height = height;
    this.dispatchEvent('resize');
    for (var allocator in this._csa) {
      if (this._csa.hasOwnProperty(allocator)) {
        var csa:ISpaceAllocator = this._csa[allocator];
        csa.setBounds(this._width, this._height);
      }
    }
    this.stage.style.perspective = this.width * Math.tan(55 * Math.PI/180) / 2 + 'px';
    // TODO: Remove webkit prefix
    this.stage.style.webkitPerspective = this.width * Math.tan(55 * Math.PI/180) / 2 + 'px';
  }

  public finish(cmt:IComment):void {
    var index:number = this.runline.indexOf(cmt);
    if (index >= 0) {
      // Remove from space allocators
      var allocator:ISpaceAllocator = this._associateAllocator(cmt.mode);
      if (allocator !== null) {
        allocator.remove(cmt);
      }

      this.runline.splice(index, 1);
      this.dispatchEvent('exitComment', cmt);
    } else {
      console.warn('Comment ' + cmt.toString() +
        ' called finish() but it was not managed by this CommentManager.');
    }
  }

  /**
  * Dispatches an event
  * @param {string} name - event name
  * @param {any} data - corresponding data
  */
  public dispatchEvent(name:string, data:any = null):void {
    if (this._listeners.hasOwnProperty(name)) {
      var listenerList:Array<Listener> = this._listeners[name];
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
  * @param {string} name - event name
  * @param {Function} listener - listener function
  */
  public addEventListener(name:string, listener:Listener):void {
    if (this._listeners.hasOwnProperty(name)) {
      this._listeners[name].push(listener);
    } else {
      this._listeners[name] = [listener];
    }
  }
}
