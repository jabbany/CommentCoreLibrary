type TimeSource  = () => number;
type Listener = (data?:any) => void;

export class TimeKeeper {
  private static DEFAULT_INTERVAL = 20;
  private _listeners:{[eventName:string]:Array<Listener>} = {};
  private _mode:string;
  private _running:boolean;
  private _timeSource:TimeSource;
  private _timerIdent:number;
  private _lastReset:number;

  constructor(
    mode:string = 'interval',
    timeSource:TimeSource = () => Date.now()) {

    if (this._mode !== 'interval' &&
      this._mode !== 'requestAnimationFrame' &&
      this._mode !== 'timer') {

      throw new Error('Unknown timer mode "' + mode + '".');
    }
    this._mode = mode;
    this._timeSource = timeSource;
    this._running = false;
  }

  get isRunning():boolean {
    return this._running;
  }

  get elapsed():number {
    return this._timeSource() - this._lastReset;
  }

  set isRunning(running:boolean) {
    if (this._running === running) {
      return;
    }
    if (this._running && !running) {
      this.stop();
    } else if (!this._running && running) {
      this.start();
    }
  }

  set elapsed(time:number) {
    throw new Error('TimeKeeper.elapsed is read-only!');
  }

  private _tick():void {
    if (!this._running) {
      return;
    }
    this.dispatchEvent('timer', this.elapsed);
    // Reschedule
    if (this._mode === 'requestAnimationFrame') {
      this._timerIdent = requestAnimationFrame((()=> this._tick()).bind(this));
    } else if (this._mode === 'timer') {
      this._timerIdent = setTimeout((() => this._tick()).bind(this));
    }
  }

  public start():void {
    if (this._running) {
      return;
    }
    this.reset();
    if (this._mode === 'interval') {
      this._timerIdent = setInterval((() => this._tick()).bind(this),
        TimeKeeper.DEFAULT_INTERVAL);
    } else if (this._mode === 'requestAnimationFrame') {
      this._timerIdent = requestAnimationFrame((() => this._tick()).bind(this));
    } else if (this._mode === 'timer') {
      this._timerIdent = setTimeout((() => this._tick()).bind(this),
        TimeKeeper.DEFAULT_INTERVAL);
    } else {
      throw new Error('Unsupported timer mode "' + this._mode + '".');
    }
    this._running = true;
  }

  public stop():void {
    if (!this._running) {
      return;
    }
    this._running = false;
    if (this._mode === 'interval') {
      clearInterval(this._timerIdent);
    } else if (this._mode === 'requestAnimationFrame') {
      cancelAnimationFrame(this._timerIdent);
    } else if (this._mode === 'timer') {
      clearTimeout(this._timerIdent);
    } else {
      throw new Error('Unsupported timer mode "' + this._mode + '".');
    }
    this._timerIdent = null;
  }

  public reset():void {
    this._lastReset = this._timeSource();
  }

  public addEventListener(event:string, listener:Listener):void {
    if (!(event in this._listeners)) {
      this._listeners[event] = [];
    }
    this._listeners[event].push(listener);
  }

  public dispatchEvent(event:string, data:any):void {
    if (event in this._listeners) {
      for (var i = 0; i < this._listeners[event].length; i++) {
        try {
          this._listeners[event][i](data);
        } catch (e) {
          console.error(e);
        }
      }
    }
  }
}
