/**
 * Generic timer-ish thing to keep track of accurate absolute time in millis.
 */
export class Timer {
  private _ref:number;
  private _time:number;
  private _isStarted:boolean;

  constructor() {
    this._ref = 0;
    this._time = 0;
    this._isStarted = false;
  }

  set time(t:number) {
    this._time = t;
    if (this._isStarted) {
      this._ref = Date.now() - this._time;
    }
  }

  get time():number {
    if (this._isStarted) {
      // Calculate a time
      return Date.now() - this._ref;
    } else {
      // Read the time
      return this._time;
    }
  }

  /**
   * Start the timer. If the timer already has time ticked, it will continue
   */
  public start():void {
    if (!this._isStarted) {
      this._ref = Date.now() - this._time;
      this._isStarted = true;
    }
  }

  /**
   * Reset the timer setting the ticked time to 0.
   */
  public reset():void {
    this._time = 0;
    this._ref = Date.now();
  }

  /**
   * Stop the timer. The time no longer updates but is preserved.
   */
  public stop():void {
    this._time = this.time;
    this._isStarted = false;
  }
}
