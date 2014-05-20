/**
 * Tween Library
 * Author: Jim Chen
 */
module Tween{
	export class ITween{
		private _target:any = null;
		private _duration:number;
		private _isPlaying:boolean = false;
		private _currentTime:number = 0;
		private _timer:number = -1;
		public step:Function;

		constructor(target:any, duration:number = 0){
			this._target = target;
			this._duration = duration;
		}

		public clone():ITween{
			var clone:ITween =new ITween(this._target, this._duration);
			clone.step = this.step;
			return clone;
		};
		public play():void{
			if(this._isPlaying)
				return;
			this.gotoAndPlay(this._currentTime);
		};
		public stop():void{
			if(!this._isPlaying)
				return;
			this.gotoAndStop(this._currentTime);
		};
		public gotoAndStop(position:number):void{

		};
		public gotoAndPlay(position:number):void{

		};
		public togglePause():void{
			if(this._isPlaying){
				this.stop();
			}else{
				this.play();
			}
		};
	}

	export function tween(){

	}
}