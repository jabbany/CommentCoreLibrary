var __OOAPI = null;

importScripts("OOAPI.js");

if(!__OOAPI){
	console.log("Error: OOAPI Not Loaded");
	self.close();
};

/** Hook independant channels, channel will not be deletable **/
__OOAPI.createChannel("::eval", 1, Math.round(Math.random() * 100000));
__OOAPI.createChannel("::debug", 1, Math.round(Math.random() * 100000));

/** Load the BSE Abstraction Runtime **/
importScripts('api/Runtime.js', 'api/ScriptManager.js', 'api/Player.js', 'api/Display.js', 'api/Tween.js', 'api/Utils.js','api/Global.js', 'api/Function.js');

/** Immediately Hook into the eval channel, blocking future hooks **/
__schannel("::eval", function(msg){
	/** Override globals **/
	var __schannel = function(){};
	var __achannel = function(){};
	var __pchannel = function(){};
	eval(msg);
});
__schannel("::debug", function(msg){
	if(msg.action === "list_channels"){
		__achannel("::worker:debug", "worker", __OOAPI.listChannels());
	}
});

__achannel("::worker:state", "worker", "running");
