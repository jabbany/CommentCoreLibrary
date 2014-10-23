var $ = function(e){return window.document.getElementById(e);}
window.addEventListener('load',function(){
	window.bscripter = new CCLScripting("../../build/scripting/Worker.js");
	bscripter.logger = new function(){
		this.log = function(t){
			$("output").innerHTML = "<pre>" + t.toString() + "</pre>" + $("output").innerHTML;
		};
		this.error = function(t){
			$("output").innerHTML = "<pre class='error'>" + t.toString() + "</pre>" + $("output").innerHTML;
		};
		this.warn = function(t){
			$("output").innerHTML = "<pre class='warning'>" + t.toString() + "</pre>" + $("output").innerHTML;
		};
	};
	window.sandbox = bscripter.getSandbox($("player"));
	$("evaluate-worker").addEventListener("click", function(){
		try{
			sandbox.eval($("code-input").value);
		}catch(e){
			$("output").innerText = e.message + "\r\n" + $("output").innerText;
		}
	});
	$("evaluate-host").addEventListener("click", function(){
		var sandbox = window.sandbox;
		try{
			eval($("console-input").value);
		}catch(e){
			bscripter.logger.error("[Host] " + e.stack.toString());
		};
	});
	function fetchFile(filename){
		var xhr = new XMLHttpRequest();
		xhr.onreadystatechange = function(){
			if(xhr.readyState === 4 && xhr.status== 200){
				$("code-input").value = xhr.responseText;
			}else if(xhr.readyState === 4){
				bscripter.logger.warn("Load file failed. Server responded with status code " + xhr.status + ".");
			}
		};
		xhr.open("GET", filename, true);
		xhr.send();
	}
	function onResize(){
		$("player").style.perspective = $("player").offsetWidth * Math.tan(40 * Math.PI/180) / 2 + "px";
		$("player").webkitPerspective = $("player").offsetWidth * Math.tan(40 * Math.PI/180) / 2 + "px";
		window.sandbox.send("Update:DimensionUpdate", window.sandbox.getContext().getDimensions());
	}
	$("debug-basic").addEventListener("click", function(){
		fetchFile("../../test/scripting/manzoku.biliscript");
	});
	$("debug-svg-madoka").addEventListener("click", function(){
		fetchFile("../../test/scripting/madoka.biliscript");
	});
	$("show-console").addEventListener("click", function(){
		$("codediv").style.display="none";
		$("consolediv").style.display="";
	});
	$("show-code").addEventListener("click", function(){
		$("codediv").style.display="";
		$("consolediv").style.display="none";
	});
	$("debug-3dsphere").addEventListener("click", function(){
		fetchFile("../../test/scripting/3dsphere.biliscript");
	});
	$("debug-custom").addEventListener("click", function(){
		var file = prompt("Please input test file name:");
		if(file !== null && file !== ""){
			fetchFile("../../test/scripting/" + file);
		}
	});
	$("debug-clear").addEventListener("click", function(){
		//bscripter.clear();
	});
	window.addEventListener("resize", function(){
		onResize();
	});
	onResize();
	//Hook tab keys
	var keytab = function(e){
		if(e.keyCode === 9){
			e.preventDefault();
			var cursor = this.selectionStart;
			var nv = this.value.substring(0,cursor),
				bv = this.value.substring(cursor, this.value.length);;
			this.value = nv + "\t" + bv;
			this.setSelectionRange(cursor + 1, cursor + 1);
		}
	};
	$("code-input").addEventListener("keydown", keytab);
	$("console-input").addEventListener("keydown", keytab);
});
