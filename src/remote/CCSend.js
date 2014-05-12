function CommentSend (server){
	var INST = {
		url : server.url,
		key : ""
	};
	this.pack = function ( comment ) {
		return comment;
	};
	this.send = function ( msg ) {
		/** Compresses the message into a neat package and sends **/
		var comment = this.pack( msg );
		
	};
}
