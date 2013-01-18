function FlexDataGrid(object){
	this.host = object;
	this.dataObject = [];
	this.filter = function(data){return data;};
	this.columns = [];
	this.colWidthMap = [];
}
FlexDataGrid.prototype.bind = function (dataObject,readerTag,filterFunction){
	if(filterFunction == null)
		filterFunction = function(data){return data;}
	this.dataObject = dataObject;
	this.columns = readerTag;
	this.filter = filterFunction;
}
FlexDataGrid.prototype.init = function (){
	var table = this.host;
	for(var i=0;i<this.dataObject.length;i++){
		var row = table.insertRow(table.rows.length);
		for(var j=0;j<this.columns.length;j++){
			var col = row.insertCell(j);
			var divx = document.createElement('div');
			divx.appendChild(document.createTextNode(this.filter(this.dataObject[i])[this.columns[j]]));
			col.appendChild(divx);
			if(this.colWidthMap[j]!=null){col.width=this.colWidthMap[j];divx.style.width=this.colWidthMap[j]+"px";};
		}
	}
}