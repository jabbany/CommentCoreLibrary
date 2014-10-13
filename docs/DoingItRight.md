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
