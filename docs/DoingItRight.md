# 推荐使用方法 Recommended Implementations

### 弹幕速度 Comment Default Speed
调整弹幕速度无需更改代码。相比之下我们更推荐使用 `CommentManager.options`下调整。相关参数是：

- `options.global.scale` 全局生存时间加成
- `options.scroll.scale` 滚动弹幕生存时间加成

默认的弹幕生存时间是 `4.000s`，加成参数叠加使用，比如如果 `global.scale = a`，`scroll.scale = b`
那么一条滚动弹幕（滚动，底部滚动，逆向）的总生存时间就是 `4 * a * b`，而固定弹幕（顶部，底部）的
生存时间则是 `4 * a`。

加成数值越大， **弹幕运行速度越低**。不过值得注意的是，每条弹幕的“速度”是不一样的，根据弹幕的长度
决定。这里的加成数值只改变弹幕的“生存时间“。

注意：改变全局加成会改变包括高级弹幕在内的所有弹幕的生存时间。请确认你真的希望这样做才更改`global`。

### 弹幕字号（和速度）同步拉伸 Autoscale Comment
如果希望实现弹幕的速度和字号同步拉伸的话，比起更改每条弹幕，我们更加推荐直接拉伸弹幕舞台/“容器”。
注意的步骤如下：
- **不要** 更改弹幕速度的加成数值，弹幕大了自然速度就慢了，没必要继续降低速度。
- 首先，确定默认的容器大小，这个大小为弹幕字号 1:1 的大小。
- 注意更新 setBounds让等比放大的弹幕容器还能继续填满视频

实现的伪代码如下：

```JavaScript
var container = document.getElementById("container");
var width = WIDTH, height = HEIGHT;

// 计算缩放比例，只看宽度
var scale = container.offsetWidth / WIDTH;

//计算高度差，更新银幕
var expHeight = (container.offsetHeight / scale);
cm.setBounds(width, expHeight); // 更新空间管理器的大小

// 用 CSS 来拉伸银幕
container.style.transform = "scale(" + scale + ")";
```

### 弹幕透明度 Opacity
弹幕透明度有两个设置方法，位于

- `options.global.opacity` 全局透明度上限
- `options.scroll.opacity` 滚动弹幕透明度上限

一般情况下，允许用户更改的透明度上限应该是滚动弹幕上限。更改全局上限的话可能引发弹幕字符画的不利显示。
注意：虽然在设置里叫opacity其实这个是对应弹幕的 alpha 字段。

### 弹幕显示模式切换 Change Global Display Mode
如果希望给弹幕更改显示模式（描边/字体/粗体等等），则可以采取更改 `options.global.className` 
的方法，来直接更改未来弹幕的寄生默认CSS类。默认情况下，弹幕都属于 `cmt` 但是你可以改掉如下：

```CSS
.cmt { /** 默认，描边，无粗体 **/ }
.cmt.bold { font-weight: bold; }
.cmt.shadow { /** 某些魔法的实现影子的CSS **/ }
```

进而通过让用户设置 `options.global.className = 'cmt bold'` 即可开启/关闭粗体等等。

### 实时弹幕支持 Live Comments
实时弹幕也需要后端服务器的支持，而且比发送弹幕要复杂一些。实时弹幕可以采取Polling（定时读取）或者
Push Notify（监听等待）两个主动和被动模式实现。实时弹幕还有绝对实时和相对性时间轴更新两个时间模式。

- Polling

    Polling是指设计的弹幕播放器定时访问服务器，询问服务器在某个弹幕池内某段时间后新产生的弹幕，然后把它
    添加到播放列表或者呈现出来的一种简单的模式。优点是：仅仅基于HTTP，可以在各种服务器（VPS、云、
    共享主机）和语言（PHP，Python，Ruby，Nodejs）上实现。缺点是：需要反复联网，效率底下，对服务
    器压力大。
    
    推荐用于实时性不强的系统。
    
- Push Notify

    Push Notify是指在客户端连接到服务器的一个端口，在有新的弹幕时，服务器主动发送弹幕信息，而客户
    端在收到信息后被动的呈现或者更新列表。优点：速度快，效率高，处理开销低。缺点：需要用Websockets
    或者Flash作为桥，要么兼容性略差一点（虽然几乎现代浏览器都支持Websockets 了），要么性能不好。
    
    推荐用于非常实时的系统，如不可回看的直播间等。

时间轴模式也不一样
    
- 绝对实时
    每当收到实时弹幕就直接显示，不保存或者少量保存历史弹幕，不能自由的回看。占用内存小。

- 实时时间轴
    定期更新时间轴，把弹幕按顺序正确插入，保持弹幕时间轴新鲜度，可以自由更改播放时间。
    
下面是两个模式的一些参考伪代码：

    // Polling example code
    
    var hasLastCheckReturned = true; // 标记之前检测是否已经完成，避免服务器过载
    var lastCheckedTime = 0; // 上次检测时间
    setTimeout(function(){
    	if(!hasLastCheckReturned){
    		return; // 上次还没返回结果。放弃这次请求。
    	}
    	var xhr = new XMLHttpRequest();
    	xhr.onreadystatechange = function(){
    		if(xhr.readyState === 4){
    			if(xhr.responseCode === 200){
    				// 解析弹幕
    				var danmakuList = yourFormatParser(xhr.responseText);
    				for(var i = 0; i < danmakuList.length; i++){
    					CM.insert(danmakuList[i]); // 把增量弹幕每一个都插入
    				};
    				lastCheckedTime = Date.now(); // 更新上次检测的时间
    				hasLastCheckReturned = true;
    			} else {
    				// 可能出了问题
    				hasLastCheckReturned = true;
    			}
    		}
    	};
    	xhr.open('GET', 'http://yoururl/somevideoid/?from=' + lastCheckedTime, true); // 告诉服务器上次检查的时间，来获取增量
    	xhr.send(); // 发送请求
    	hasLastCheckReturned = false;
    }, 3000); // 每3s检查新的弹幕
    
以及：

    // Push notify example code
    // 基于 socket.io 和 JQuery来简化代码
    
    var socket = io(); //开启流
    
    socket.on('danmaku', function(data){
    	// 当遇到 danmaku 事件，就把推送来的弹幕推送给 CCL
    	var danmaku = yourFormatParser(data);
    	CM.insert(danmaku);
    });
    
    $('#send-danmaku-btn').click(function(){
    	//当按了发送弹幕的按钮
    	var data = {
    		"text":"获取信息。。"
    		...
    	};// 通过UI获取新弹幕的信息
    	
    	//包装并发射弹幕
    	socket.emit('send-danmaku', JSON.stringify(yourFormatPackager(data));
    	
    	//清除 UI 文字部分
    	$('#send-danmaku-field').value("");
    });
