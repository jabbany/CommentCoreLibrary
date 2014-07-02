function TabManager(parentO){
	this.parent = parentO;
	this.boundInitObjects = [];
	this.current = '';
}
TabManager.prototype.bindAction = function(action){
	this.boundInitObjects.push(action);
	var tam = this;
	var tabName = action + "";
	document.getElementById('tab_' + action[0]).addEventListener('click',function(){
		tam.doTabSwitch(action[0]);
	});
}
TabManager.prototype.doTabSwitch = function(tab){
	if(this.boundInitObjects.length == 0)
		return;
	if(this.current == tab)
		return;
	var found = false;
	for(var i=0;i<this.boundInitObjects.length;i++){
		if(this.boundInitObjects[i][0] == tab){
			document.getElementById(this.boundInitObjects[i][1]).style.display="";
			document.getElementById('tab_'+this.boundInitObjects[i][0]).className = 'tabbtn current';
			found = true;
			this.current = tab;
		}else{
			document.getElementById(this.boundInitObjects[i][1]).style.display="none";
			document.getElementById('tab_'+this.boundInitObjects[i][0]).className = 'tabbtn';
		}
	}
	if(!found)
		this.doTabSwitch(this.boundInitObjects[0][0]);
}