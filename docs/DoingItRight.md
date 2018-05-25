# 推荐使用方法 Recommended Implementations
以下包括一些常见的问题，和我们推荐的解决方案。

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
的方法，来直接更改未来弹幕的寄生默认 CSS 类。默认情况下，弹幕都属于 `cmt` 但是你可以改掉如下：

```CSS
.cmt { /** 默认，描边，无粗体 **/ }
.cmt.bold { font-weight: bold; }
.cmt.shadow { /** 某些魔法的实现影子的CSS **/ }
```

进而通过让用户设置 `options.global.className = 'cmt bold'` 即可开启/关闭粗体等等。

### 用户发送弹幕加上蓝色边框 Add Border for Self-Sent Comments
实现加边框很容易，不过采用了一些机智的逻辑。实现可以参考如下代码：

````JavaScript
$('#send-button').click(function (){ // 为了简单采取类似 jQuery 的语法
  var myCommentText = $('#danmaku-textarea').value;

  // 检测以下是不是可以发
  if (myCommentText.length === 0 || !canSend(myCommentText)) {
    $('#user-notice').showNotice('弹幕空或者不符合规定'); // 提醒用户
    return; // 取消发送
  }

  var comment = {
    'text': myCommentText,
    'stime': video.currentTime * 1000 - 1, // 比现在时间稍微慢一ms
    'mode': 1,
    'color': 0xffffff,
    'border': true
  };

  CM.time(video.currentTime * 1000) // 强行更新以下 CM 的时间戳
  CM.insert(comment); // 插入这个弹幕，因为时间 < CM内现在播放时间，所以一定不会被显示
  sendCommentToServer(comment); // 把弹幕发到服务器上，注意服务器要无视 border=true 的

  CM.send(comment); // 立刻显示一次自己这条弹幕，保证用户肯定会看到
  //由于弹幕也被插入了 timeline， 如果用户回看，会发现弹幕依然带边框
});
````

### 实时弹幕支持 Live Comments
实时弹幕也需要后端服务器的支持，而且比发送弹幕要复杂一些。实时弹幕可以采取 Polling（定时读取）
或者 Push Notify（监听等待）两个主动和被动模式实现。实时弹幕还有绝对实时和相对性时间轴更新
两个时间模式。

- Polling 查询

    Polling是指设计的弹幕播放器定时访问服务器，询问服务器在某个弹幕池内某段时间后新产生的弹幕，
    然后把它添加到播放列表或者呈现出来的一种简单的模式。优点是：仅仅基于HTTP，可以在各种服务器
    （VPS、云、共享主机）和语言（PHP，Python，Ruby，Nodejs）上实现。缺点是：需要反复联网，
    效率底下，对服务器压力大。

    推荐用于实时性不强的系统，比如播放非直播视频时、动态载入新弹幕。

- Push Notify 推送

    Push Notify是指在客户端连接到服务器的一个端口，在有新的弹幕时，服务器主动发送弹幕信息，
    而客户端在收到信息后被动的呈现或者更新列表。优点：速度快，效率高，处理开销低。缺点：
    需要用 Web Sockets 或者 Flash 作为桥，在兼容性上都有一定局限性。

    推荐用于非常实时的系统，如不可回看的直播间、大型荧幕上滚动弹幕等。

时间轴模式也不一样

- 实时（无时间轴）
    每当收到实时弹幕就直接显示，不保存或者非常少量缓存历史弹幕。由于没有使用时间轴，所以不能
    通过 CCL 自由的回看刚刚滚过去的弹幕。优点是占用内存小，弹幕显示后就不保存在时间轴里了，
    同时适合直播等没有时间轴的媒体。

- 传统（基于时间轴）
    定期更新时间轴，把弹幕按顺序正确插入，保持弹幕时间轴新鲜度，可以自由更改播放时间
    （快进快退）。优点是可以支持用户搓时间轴，缺点是直播环境下需要控制时间轴不能过度饱和。

#### 参考伪代码

````JavaScript
// Polling example code

var hasLastCheckReturned = true; // 标记之前检测是否已经完成，避免服务器过载
var lastCheckedTime = 0; // 上次检测时间
setInterval(function() {
    if (!hasLastCheckReturned) {
        return; // 上次还没返回结果。放弃这次请求。
    }
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === 4) {
            if (xhr.responseCode === 200) {
                // 解析新增的弹幕
                var danmakuList = yourFormatParser(xhr.responseText);
                for (var i = 0; i < danmakuList.length; i++) {
                    CM.insert(danmakuList[i]); // 把增量弹幕每一个都插入
                }
                lastCheckedTime = Date.now(); // 更新上次检测的时间
                hasLastCheckReturned = true;
            } else {
                // 可能出了问题
                console.log(xhr.responseText);
                hasLastCheckReturned = true;
            }
        }
    };
    xhr.open('GET', 'http://yoururl/somevideoid/?from=' + lastCheckedTime, true); // 告诉服务器上次检查的时间，来获取增量
    xhr.send(); // 发送请求
    hasLastCheckReturned = false;
}, 3000); // 每3s检查新的弹幕
````

以及：

````JavaScript
// Push notify example code
// 基于 socket.io 和 JQuery来简化代码

var socket = io(); //开启流

socket.on('danmaku', function(data){
    // 当遇到 danmaku 事件，就把推送来的弹幕推送给 CCL
    var danmaku = yourFormatParser(data);
    if (danmaku.hasOwnProperty('stime')) {
        // 弹幕有时间轴位置，那就插入时间轴
        CM.insert(danmaku);
    } else {
        // 弹幕没有时间轴位置就立刻显示（不记录）
        CM.send(danmaku);
    }
});

$('#send-danmaku-btn').click(function(){
    //当按了发送弹幕的按钮
    var data = {
        "text": $('#send-danmaku-field').value,
        "stime": myVideo.currentTime,
        ...
    };// 通过UI获取新弹幕的信息

    //包装并发射弹幕
    socket.emit('danmaku', JSON.stringify(yourFormatPackager(data)));

    //清除 UI 文字部分
    $('#send-danmaku-field').value("");
});
````

#### 实时时间轴模式
实时弹幕的时间轴需求会根据实现目标不同而不同，以下是两种常见场景的实现方法。

大屏幕直播弹幕：用户使用自己的终端发送弹幕，大屏幕上实时进行显示。由于只需要实时显示（无需回到过去的
时间点），建议采用 **无时间轴模式**:

````JavaScript
CM = new CommentManager(...);

CM.init();
CM.start();
// 注意我们在这种模式下无需调用time或者伪造时间轴

// 某种方式获得了新的弹幕后...（此处示例socket模式）
socket.on('danmaku', function (data) {
  CM.send(commentData); // 注意这里直接用了 CM.send 全程也无需调用 time
});
````

网上视频直播：视频直播虽然需要随时播放弹幕，但是同时还允许用户回到过往的时间部分，看过往部分的弹幕。
这时需要有时间轴模式

````JavaScript
CM = new CommentManager(...);

CM.init();
CM.start();

videoStream.addEventListener('timeUpdate', function () {
    CM.time(videoStream.currentTime * 1000); // 时刻通知流媒体播放时间
});

socket.on('danmaku-update', function (data) {
    CM.insert(data); // 注意这里是把弹幕插入时间轴。
});
````
