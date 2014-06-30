/** 
Comment Filters/Filter Lang
Licensed Under MIT License
**/

function CommentFilter(){
	this.rulebook = {"all":[]};
	this.modifiers = [];
	this.runtime = null;
	this.allowTypes = {
		"1":true,
		"4":true,
		"5":true,
		"6":true,
		"7":true,
		"8":true,
		"17":true
	};
	this.doModify = function(cmt){
		for(var k=0;k<this.modifiers.length;k++){
			cmt = this.modifiers[k](cmt);
		}
		return cmt;
	};
	this.isMatchRule = function(cmtData,rule){
		switch(rule['operator']){
			case '==':if(cmtData[rule['subject']] == rule['value']){return false;};break;
			case '>':if(cmtData[rule['subject']] > rule['value']){return false;};break;
			case '<':if(cmtData[rule['subject']] < rule['value']){return false;};break;
			case 'range':if(cmtData[rule['subject']] > rule.value.min && cmtData[rule['subject']] < rule.value.max){return false;};break;
			case '!=':if(cmtData[rule['subject']] != rule.value){return false;}break;
			case '~':if(new RegExp(rule.value).test(cmtData[rule[subject]])){return false;}break;
			case '!~':if(!(new RegExp(rule.value).test(cmtData[rule[subject]]))){return false;}break;
		}
		return true;
	};
	this.beforeSend = function(cmt){
		//Check with the rules upon size
		var cmtMode = cmt.data.mode;
		if(this.rulebook[cmtMode]!=null){
			for(var i=0;i<this.rulebook[cmtMode].length;i++){
				if(this.rulebook[cmtMode][i].subject == 'width' || this.rulebook[cmtMode][i].subject == 'height'){
					if(this.rulebook[cmtMode][i].subject == 'width'){
						switch(this.rulebook[cmtMode][i].operator){
							case '>':if(this.rulebook[cmtMode][i].value < cmt.offsetWidth)return false;break;
							case '<':if(this.rulebook[cmtMode][i].value > cmt.offsetWidth)return false;break;
							case 'range':if(this.rulebook[cmtMode][i].value.max > cmt.offsetWidth && this.rulebook[cmtMode][i].min < cmt.offsetWidth)return false;break;
							case '==':if(this.rulebook[cmtMode][i].value == cmt.offsetWidth)return false;break;
							default:break;
						}
					}else{
						switch(this.rulebook[cmtMode][i].operator){
							case '>':if(this.rulebook[cmtMode][i].value < cmt.offsetHeight)return false;break;
							case '<':if(this.rulebook[cmtMode][i].value > cmt.offsetHeight)return false;break;
							case 'range':if(this.rulebook[cmtMode][i].value.max > cmt.offsetHeight && this.rulebook[cmtMode][i].min < cmt.offsetHeight)return false;break;
							case '==':if(this.rulebook[cmtMode][i].value == cmt.offsetHeight)return false;break;
							default:break;
						}
					}
				}
			}
			return true;
		}else{return true;}
	}
	this.doValidate = function(cmtData){
		if(!this.allowTypes[cmtData.mode])
			return false;
		/** Create abstract cmt data **/
		var abstCmtData = {
			text:cmtData.text,
			mode:cmtData.mode,
			color:cmtData.color,
			size:cmtData.size,
			stime:cmtData.stime,
			hash:cmtData.hash,
		}
		if(this.rulebook[cmtData.mode] != null && this.rulebook[cmtData.mode].length > 0){
			for(var i=0;i<this.rulebook[cmtData.mode];i++){
				if(!this.isMatchRule(abstCmtData,this.rulebook[cmtData.mode][i]))
					return false;
			}
		}
		for(var i=0;i<this.rulebook[cmtData.mode];i++){
			if(!this.isMatchRule(abstCmtData,this.rulebook[cmtData.mode][i]))
				return false;
		}
		return true;
	};
	this.addRule = function(rule){
		if(this.rulebook[rule.mode + ""] == null)
			this.rulebook[rule.mode + ""] = [];
		/** Normalize Operators **/
		switch(rule.operator){
			case 'eq':
			case 'equals':
			case '=':rule.operator='==';break;
			case 'ineq':rule.operator='!=';break;
			case 'regex':
			case 'matches':rule.operator='~';break;
			case 'notmatch':
			case 'iregex':rule.operator='!~';break;
		}
		this.rulebook[rule.mode].push(rule);
		return (this.rulebook[rule.mode].length - 1);
	};
	this.addModifier = function(f){
		this.modifiers.push(f);
	};
	this.runtimeFilter = function(cmt){
		if(this.runtime == null)
			return cmt;
		return this.runtime(cmt);
	};
	this.setRuntimeFilter = function(f){
		this.runtime = f;
	}
}
