/**
 * Player Library
 * Author: Jim Chen
 */
/// <reference path="../OOAPI.d.ts" />

/// <reference path="Sound.ts" />
module Player{
	var _state:string = "";
	var _time:string;
	var _commentList:string;
	var _refreshRate:number;
	var _width:number;
	var _height:number;
	var _videoWidth:number;
	var _videoHeight:number;
	var _lastUpdate:number;

	export var state:string;
	export var time:string;
	export var commentList:Array<Object>;
	export var refreshRate:number;
	export var width:number;
	export var height:number;
	export var videoWidth:number;
	export var videoHeight:number;
	export var version:string;

	Object.defineProperty(Player, 'state', {
		get: function() { return _state; },
		set: function(value) {
			__trace("Player.state is read-only", "warn");
		}
	});
	Object.defineProperty(Player, 'time', {
		get: function() {
			if(_state !== "playing") {
				return _time;
			}else{
				return _time + (Date.now() - _lastUpdate);
			}
		},
		set: function(value) {
			__trace("Player.time is read-only", "warn");
		}
	});
	Object.defineProperty(Player, 'commentList', {
		get: function() {
			return _commentList;
		},
		set: function(value) {

		}
	});
	Object.defineProperty(Player, 'refreshRate', {
		get: function() {
			return _refreshRate;
		},
		set: function(value) {

		}
	});
	Object.defineProperty(Player, 'width', {
		get: function() { return _width; },
		set: function(value) {
			__trace("Player.width is read-only", "warn");
		}
	});
	Object.defineProperty(Player, 'height', {
		get: function() { return _height; },
		set: function(value) {
			__trace("Player.height is read-only", "warn");
		}
	});
	Object.defineProperty(Player, 'videoWidth', {
		get: function() { return _videoWidth; },
		set: function(value) {
			__trace("Player.videoWidth is read-only", "warn");
		}
	});
	Object.defineProperty(Player, 'videoHeight', {
		get: function() { return _videoHeight; },
		set: function(value) {
			__trace("Player.videoHeight is read-only", "warn");
		}
	});
	Object.defineProperty(Player, 'version', {
		get: function() {
			return "CCLPlayer/1.0 HTML5/* (bilibili, like BSE, like flash)"; },
		set: function(value) {
			__trace("Player.version is read-only", "warn");
		}
	});

	/**
	 * Requests the player to start playing.
	 */
	export function play():void{
		__pchannel("Player::action", {
			"action":"play"
		});
	}

	/**
	 * Requests the player to pause
	 */
	export function pause():void{
		__pchannel("Player::action", {
			"action":"pause"
		});
	}

	/**
	 * Seeks to a position (in milliseconds from start)
	 * @param offset - milliseconds offset
	 */
	export function seek(offset:number):void{
		__pchannel("Player::action", {
			"action":"seek",
			"params":offset
		});
	}

	/**
	 * Jump to another video
	 * Note that this may not work if the Host policy does not allow it
	 *
	 * @param video - video id
	 * @param page - video page (defaults to 1)
	 * @param newWindow - open the video in a new window or not
	 */
	export function jump(video:string, page:number = 1, newWindow:boolean = false):void{
		__pchannel("Player::action", {
			"action":"jump",
			"params":{
				"vid":video,
				"page":page,
				"window":newWindow
			}
		});
	}

	export function commentTrigger(callback:Function, timeout:number):void{

	}

	export function keyTrigger(callback:Function, timeout:number):void{

	}

	export function setMask(mask:any):void{
		__trace("Masking not supported yet", 'warn');
	}

	export function toString(){
		return "[player Player]";
	}

	/** Update Listeners **/
	__schannel("Update:DimensionUpdate", function(payload){
		_width = payload["stageWidth"];
		_height = payload["stageHeight"];
		if(payload.hasOwnProperty("videoWidth") && payload.hasOwnProperty("videoHeight")) {
			_videoWidth = payload["videoWidth"];
			_videoHeight = payload["videoHeight"];
		}
	});

	__schannel("Update:TimeUpdate", function(payload){
		_state = payload["state"];
		_time = payload["time"];
		_lastUpdate = Date.now();
	});
}