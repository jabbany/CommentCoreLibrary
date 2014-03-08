CommonFormat JSON标准化弹幕定义
===================
以下标为“[OPT]” 为可选字段，剩下的为必选字段。

    {
    	"text": <String>,
    	"stime": <uint>,
    	"type": <String>,
    	"color": <String. Format in HTML hexcode "RRGGBB">,
    	"id": <uint Database ID>,
    	"ctime": <Timestamp. Creation Date>,
    	[OPT] "params":{
    		
    	}
    }
