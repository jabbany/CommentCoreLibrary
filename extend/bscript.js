// B-script offers a set of APIs that mimic the Biliplayer's Scritping API. We try to import the scripts from bili
CCLScripting = {"v":0.8}
CCLScripting.createScriptingContext = function(){
	return new function(){
		this.vars = {};
		this.api = {};
	}
}

CCLScripting.TextFormat = function(){
	this.bold = false;
	this.italic = false;
	this.underline = false;
	this.color = "#000";
	this.font = "";
	this.outline = "shadow";
}

CCLScripting.CommentObject = function(text, type){
	this.text = text;
	this.mode = type;
}

CCLScripting.CommentObject.prototype.getTextFormat = function(){
	return new CCLScripting.TextFormat();
}

CCLScripting.CommentObject.prototype.setTextFormat = function(tf){
	return;
}
