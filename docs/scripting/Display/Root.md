Root Element 根（舞台）对象
==================================
请尽可能避免使用舞台对象。

舞台对象（Root Object）是 BSE 开放的一套用于操作弹幕舞台的函数入口。它在
[官方文档](http://docs.bilibili.cn/wiki/Display)中 __并没有__ 被给出，但是由于大量的高级
弹幕使用了此接口，KagerouEngine也实现了部分支持。该支持可以通过 `$.root` 或者 
`Display.root` 访问。

请尽可能避免使用舞台对象。（因为很重要所以又说了一次）

事件监听的潜在问题（Listener Problems）
----------------------------------
Root元素和其他的元素在监听器构造上有截然不同的设计需求，因为弹幕舞台很可能会由多个播放器同时
占用。在其余的API中，我们都可以认为 KagerouEngine 显示端可以独占舞台，但是在 root 元素上我们
不能这样认为。这一限制条件，加之 [影子对象](../Instances.md) 的设计，由控制外播放元件产生的
对象，我们没有沙箱内绑定。在触发诸如 `Event.ADDED` 事件时，我们就没有办法有效的体现这些对象的
代码类。即使是有沙箱内绑定的，对于如 `Event.ADDED` 事件的触发也非常困难，因为这个Event需要
寻找对应的 ID 并发起脚本端寻找实例的操作。

对于外部添加的非受控对象，KagerouEngine的Host端可能采取两种措施：

1. 对于不认识的可还原对象，如果自己报告了自己，试图绑定为一个临时 DisplayObject。
注意：对这个临时DisplayObject的操作未必会真的有正确的效果，因为我们不知道原 DO 的类绑定，
也无法擅自解除绑定。我们更不能确保初始化的这个临时 DO 的属性都正确，甚至连 
`x,y,width,height,boundingbox` 都无法完美的确保。任何依赖这个临时 DO 的操作都不被正式API
支持。

2. 不理睬不被报告的对象。

### 报告对象
对象如果希望触发 `Event.ADDED`，__必须__ 在添加的同时触发 stage 的一个监听器。

```JavaScript
// This is the [[HOST SIDE]]. 
var stage = SomeHTMLDOMElement;
stage.appendChild(myNewElement);
stage.dispatchEvent(new CustomEvent("registerKagerou",{
	"details":{
		"classType":"DisplayObject",
		"id": "PleaseMakeYourOwnUNIQUEid",
		"serialized":{
			"methods":["myMethodName"],
			"properties":[{
				"name":"myPropertyName",
				"value":initialValue,
			}]
		},
		"dom": DOMObject
	},
	"bubbles": false,
	"cancelable": true
}));
```

在对象被删除的时候还需要回收！如下：

```JavaScript
// This is the [[HOST SIDE]]. 
var stage = SomeHTMLDOMElement;
stage.removeChild(myNewElement);
stage.dispatchEvent(new CustomEvent("deregisterKagerou",{
	"details":{
		"id": "PleaseMakeYourOwnUNIQUEid"
	},
	"bubbles": false,
	"cancelable": true
}));
```

注意两次的ID必须一致。至于具体怎么编这个ID留给各个程序，不过为了避免各个程序的命名空间冲突，建议
采取如下格式（注意只是建议）：

    myApplicatioName:ThisObjectName
    
这样就不容易产生命名冲突了。在两个name里面避免使用“:”，如果需要进一步划分命名空间则可以考虑在 
`ThisObjectName` 那个字段里面发挥。

### 使用临时的DisplayObject
使用的时候要小心，不是所有的属性都被支持，不是所有的值都会返回正确。还有就是把Object实例导出后
有可能会遇到Object消亡。举例如下：

```JavaScript
var outside;
function listener(e){
    var tempDO = e.target;
    outside = tempDO;
}
$.root.addEventListener("added",listener);
```

随后，这个Object消亡了。如果有正确的 deregister ，那么沙箱内的 Runtime 下应该不会注册这个
Object，但是其依然可以根据保存的既有 objectId 调用沙箱外的 Context。但是因为对象一进不存在，
所以调用会失败。

一般来说我们认为在监听器函数内部的连贯操作下应该不会发生 target 消亡的情况。但是这也不是保证。

