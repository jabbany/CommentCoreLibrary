/**
 * Binary Search Stubs for JS Arrays
 * @license MIT
 * @author Jim Chen
 */
var BinArray = (function(){
	var BinArray = {};
	BinArray.bsearch = function(arr, what, how){
		if(arr.length === 0) {
			return 0;
		}
		if(how(what,arr[0]) < 0) {
			return 0;
		}
		if(how(what,arr[arr.length - 1]) >=0) {
			return arr.length;
		}
		var low =0;
		var i = 0;
		var count = 0;
		var high = arr.length - 1;
		while(low<=high){
			i = Math.floor((high + low + 1)/2);
			count++;
			if(how(what,arr[i-1])>=0 && how(what,arr[i])<0){
				return i;
			}
			if(how(what,arr[i-1])<0){
				high = i-1;
			}else if(how(what,arr[i])>=0){
				low = i;
			}else {
				console.error('Program Error');
			}
			if(count > 1500) { console.error('Too many run cycles.'); }
		}
		return -1; // Never actually run
	};
	BinArray.binsert = function(arr, what, how){
		var index = BinArray.bsearch(arr,what,how);
		arr.splice(index,0,what);
		return index;
	};
	return BinArray;
})();
