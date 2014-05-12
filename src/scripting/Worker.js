/** Assume that the OOAPI has been defined and initialized **/
if(!__OOAPI){
	importScripts("OOAPI.js");
	if(!__OOAPI){
		console.log("Error: OOAPI Not Loaded");
		self.close();
	};
}
/** Hook an independant channel, this channel will not be deletable **/
__OOAPI.createChannel("::eval", 1, Math.round(Math.random() * 100000));

/** Load the BSE Abstraction Runtime **/
importScripts('Runtime.js', 'ScriptManager.js', 'Player.js', 'Display.js', 'Tween.js', 'Utils.js', 'Function.js');

/** Immediately Hook into the eval channel, blocking future hooks **/
__schannel("::eval", function(msg){
	eval(msg);
});

__achannel("::worker:state", "worker", "running");
