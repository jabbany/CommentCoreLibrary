/**
 * Player sound
 */
module Player{
	class Sound{
		private _source:string;
		private _isPlaying:boolean = false;
		public onload:Function;
		constructor(type:string, onload:Function){
			this.onload = onload;
			this._source = type;
		}
		public createFromURL(url:string):void{
			this._source = url;
		}
		public play():void{

		}
		public remove():void{

		}
		public stop():void{

		}
		public loadPercent():number{
			return 0;
		}
		public serialize():Object{
			return {
				"class":"Sound",
				"url":this._source
			};
		}
	}
}