/*!
 * Comment Core Library CommentManager
 * @license MIT
 * @author Jim Chen
 *
 * Copyright (c) 2014 Jim Chen
 */
import type { CCLOptions, ICommentManager, ICommentFactory, IComment,
  IScriptingEngine } from './core/Core';
import * as BinArray from './Array';
import { CommentFactory } from './core/CommentFactory';
import { CommentSpaceAllocator, AnchorCommentSpaceAllocator } from './core/CommentSpaceAllocator';
import { CommentFilter } from './filter/CommentFilter';

var _defaultComparator = function (a, b) {
  if (a.stime > b.stime) {
    return 2;
  } else if (a.stime < b.stime) {
    return -2;
  } else {
    if (a.date > b.date) {
      return 1;
    } else if (a.date < b.date) {
      return -1;
    } else if (a.dbid != null && b.dbid != null) {
      if (a.dbid > b.dbid) {
        return 1;
      } else if (a.dbid < b.dbid) {
        return -1;
      }
      return 0;
    } else {
      return 0;
    }
  }
};

export class CommentManager implements ICommentManager {
  private _timer:number = 0;
  private _listeners:{[event:string]:Array<Function>} = {};
  private _lastPosition:number = 0;

  public stage:HTMLElement;
  public options:CCLOptions = {
    global:{
      opacity:1,
      scale:1,
      className:"cmt"
    },
    scroll:{
      opacity:1,
      scale:1
    },
    limit: 0,
    seekTrigger: 2000
  };
  public timeline:Array<any> = [];
  public runline:Array<IComment> = [];
  public position:number = 0;

  public factory:ICommentFactory = null;
  public filter:CommentFilter = null;
  public scripting:IScriptingEngine;
  public csa:{[name:string]:CommentSpaceAllocator} = {
    scroll: new CommentSpaceAllocator(0,0),
    top: new AnchorCommentSpaceAllocator(0,0),
    bottom: new AnchorCommentSpaceAllocator(0,0),
    reverse: new CommentSpaceAllocator(0,0),
    scrollbtm: new CommentSpaceAllocator(0,0)
  };

  public width:number;
  public height:number;

  constructor(stageObject:HTMLElement) {
    this.stage = stageObject;

    /** Precompute the offset width **/
    this.width = this.stage.offsetWidth;
    this.height = this.stage.offsetHeight;
  }

  private _startTimer():void {
    if (this._timer > 0) {
      return;
    }
    var lastTPos = new Date().getTime();
    var cmMgr = this;
    this._timer = window.setInterval(function () {
      var elapsed = new Date().getTime() - lastTPos;
      lastTPos = new Date().getTime();
      cmMgr.onTimerEvent(elapsed,cmMgr);
    },10);
  }

  private _stopTimer():void {
    window.clearInterval(this._timer);
    this._timer = 0;
  }

  /** Public **/
  public stop():void {
    this._stopTimer();
    // Send stop signal to all comments
    this.runline.forEach(function (c) { c.stop(); });
  }

  public start():void {
    this._startTimer();
  }

  public seek(time:number):void {
    this.position = BinArray.bsearch(this.timeline, time, function(a,b){
      if (a < b.stime) {
        return -1
      } else if(a > b.stime) {
        return 1;
      } else {
        return 0;
      }
    });
  }

  public validate(cmt:any):boolean {
    if (cmt == null) {
      return false;
    }
    return this.filter.doValidate(cmt);
  }

  public load(a:Array<any>):void {
    this.timeline = a;
    this.timeline.sort(_defaultComparator);
    this.dispatchEvent("load");
  }

  public insert(c:any):void {
    var index = BinArray.binsert(this.timeline, c, _defaultComparator);
    if (index <= this.position) {
      this.position++;
    }
    this.dispatchEvent("insert");
  }

  public clear():void {
    while (this.runline.length > 0) {
      this.runline[0].finish();
    }
    this.dispatchEvent("clear");
  }

  public setBounds():void {
    this.width = this.stage.offsetWidth;
    this.height= this.stage.offsetHeight;
    this.dispatchEvent("resize");
    for (var comAlloc in this.csa) {
      this.csa[comAlloc].setBounds(this.width,this.height);
    }
    // Update 3d perspective
    this.stage.style.perspective = this.width / Math.tan(55 * Math.PI/180) / 2 + "px";
    this.stage.style['webkitPerspective'] = this.width / Math.tan(55 * Math.PI/180) / 2 + "px";
  }

  public init(renderer?:string):void {
    this.setBounds();
    if (this.filter == null) {
      this.filter = new CommentFilter(); //Only create a filter if none exist
    }
    if (this.factory == null) {
      switch (renderer) {
        case 'legacy':
          this.factory = CommentFactory.defaultFactory();
          break;
        default:
        case 'css':
          this.factory = CommentFactory.defaultCssRenderFactory();
          break;
      }
    }
  }

  public time(time:number):void {
    time = time - 1;
    if (this.position >= this.timeline.length ||
      Math.abs(this._lastPosition - time) >= this.options.seekTrigger) {

      this.seek(time);
      this._lastPosition = time;
      if (this.timeline.length <= this.position) {
        return;
      }
    } else {
      this._lastPosition = time;
    }
    var batch = [];
    for (;this.position < this.timeline.length;this.position++) {
      if (this.timeline[this.position]['stime'] <= time) {
        if (this.options.limit > 0 &&
          this.runline.length + batch.length >= this.options.limit) {

          continue; // Skip comments but still move the position pointer
        } else if (this.validate(this.timeline[this.position])) {
          batch.push(this.timeline[this.position]);
        }
      } else {
        break;
      }
    }
    if (batch.length > 0) {
      this.send(batch);
    }
  }

  public rescale():void {
    // TODO: Implement rescaling
  }

  private _preprocess(data:any):any {
    if (data.mode === 8) {
      // This comment is not managed by the comment manager
      console.log(data);
      if (this.scripting) {
        console.log(this.scripting.eval(data.code));
      }
      return null;
    }
    if (this.filter != null) {
      data = this.filter.doModify(data);
    }
    return data;
  }

  private _allocateSpace(cmt:IComment):void {
    switch (cmt.mode) {
      default:
      case 1: { this.csa.scroll.add(cmt); } break;
      case 2: { this.csa.scrollbtm.add(cmt); } break;
      case 4: { this.csa.bottom.add(cmt); } break;
      case 5: { this.csa.top.add(cmt); } break;
      case 6: { this.csa.reverse.add(cmt); } break;
      case 7:
      case 17: {/* Do NOT manage these comments! */} break;
    }
  }

  public send(data:any):void {
    if (!Array.isArray(data)) {
      data = [ data ];
    }
    // Validate all the comments
    data = data.map(
      this._preprocess.bind(this)).filter(function (item) {
        return item !== null;
      });
    if (data.length === 0) {
      return;
    }
    data.map((function (item) {
      // Create and insert the comments into the DOM
      return this.factory.create(this, item);
    }).bind(this)).map((function (cmt) {
      this._allocateSpace(cmt);
      return cmt;
    }).bind(this)).forEach((function (cmt) {
      cmt.y = cmt.y;
      this.dispatchEvent("enterComment", cmt);
      this.runline.push(cmt);
    }).bind(this));
  }

  public finish(cmt:IComment):void {
    this.dispatchEvent("exitComment", cmt);
    this.stage.removeChild(cmt.dom);
    var index = this.runline.indexOf(cmt);
    if (index >= 0) {
      this.runline.splice(index, 1);
    }
    switch (cmt.mode) {
      default:
      case 1: {this.csa.scroll.remove(cmt);} break;
      case 2: {this.csa.scrollbtm.remove(cmt);} break;
      case 4: {this.csa.bottom.remove(cmt);} break;
      case 5: {this.csa.top.remove(cmt);} break;
      case 6: {this.csa.reverse.remove(cmt);} break;
      case 7: break;
    }
  }

  public addEventListener(event:string, listener:Function):void {
    if (typeof this._listeners[event] !== "undefined") {
      this._listeners[event].push(listener);
    } else {
      this._listeners[event] = [listener];
    }
  }

  public dispatchEvent(event:string, data?:any):void {
    if (typeof this._listeners[event] !== "undefined") {
      for (var i = 0; i < this._listeners[event].length; i++) {
        try {
          this._listeners[event][i](data);
        } catch (e) {
          console.error(e.stack);
        }
      }
    }
  }

  /** Static Functions **/
  public onTimerEvent(timePassed:number, cmObj:CommentManager):void {
    for (var i= 0;i < cmObj.runline.length; i++) {
      var cmt = cmObj.runline[i];
      cmt.time(timePassed);
    }
  }
}
