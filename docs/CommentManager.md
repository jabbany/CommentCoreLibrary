# 弹幕管理器 CommentManager
弹幕管理器自 `v1.0` 后将改成支持多种多层渲染的模式了，在此之前请先参考一些[不完整的API实现](CommentCoreLibraryAPI.md)。

## Properties 属性

### options &lt;Object&gt;
此处用于放置弹幕默认参数等.

* global
  * `opacity` 透明度
  * `scale` 生命时间加成（TTL Scale）
  * `className` CSS类名（非CSS呈现模式下也可能会参考此项进行呈现）
* scroll
  * `opacity` 透明度
  * `scale` 生命时间加成（TTL Scale）
* `limit` 最大显示弹幕数量，0或以下表示不限制同屏弹幕数量

### isRunning &lt;Bool&gt;
管理器的弹幕是否在运行。`false`表示没有在运行，`true`表示在运行。可以通过 start/stop 控制。这
个参数只反映运行列表里面弹幕的运行状态，而不是视频的。

### width &lt;Number&gt;
舞台的长度像素值，用于计算弹幕位置。此数只有在 init 之后才有效。

### height &lt;Number&gt;
舞台的高度像素值，用于计算弹幕位置。此数只有在 init 之后才有效。

## Methods 方法

### init()
初始化弹幕管理器并初次绑定舞台大小。注意：`init`调用时请确保弹幕舞台对象可以访问，并且已经实例化和
可测大小。如果在动态的构成组件，只要保证在调用 `init()` 时舞台返回的大小数据正确即可。

初始化管理器默认播放状态是未播放，需要单独通过 `start()` 启用

### start()
启动弹幕老化进程。调用后 `send()` 发送到运行列表（runline）的弹幕会开始移动。用于在刚刚 
`init()` 之后进入播放状态，或者在暂停弹幕后重新开始移动弹幕。播放时调用无作用。

注意：在播放状态未非播放时，调用 `send()`发送的弹幕会加入 runline，在start之后一并开始移动。
有时这种表现是你不希望的，可以通过 `clear()` 清除运行列表。

### stop()
暂停弹幕。运行中的弹幕将会暂停，不回被清除。暂停时调用无作用。

注意：stop不会停止 `time` 方法的调用，所以在实现暂停时应配合停止 time 调用，否则下次启动时停止
期间的弹幕会一并开始移动。

### clear()
清除舞台。清除正在运行的管理器管辖内的所有弹幕（runline里的）。
不清除 timeline。不保证能清除代码弹幕（因为是另一个独立的系统）。

### time(currentTime:Number)
通报目前的时间轴时间。管理器会自动处理时间前进和后退的情况，包括在需要时清除屏幕上正再运行的弹幕。
这里的currentTime是绝对时间，对应弹幕的 stime。时间单位是毫秒（ms）。time只会把相关的弹幕放到
runline（运行列表）里，至于这些弹幕是否在移动，则要根据目前管理器的 isRunning 状态。

### load(timeline:Array&lt;ICommentData&gt;)
载入一些抽象弹幕对象作为时间轴。这些弹幕对象不必排序，管理器会自动根据 stime 进行排序。`load` 会
清空之前的时间轴。请不要在播放的时候重新 load 因为那样会导致位置指针不连续而产生奇怪的bug。可以事先
进行 `time(0)` 或者 `seek(0)` 操作来把播放位置复原到0。

动态更改弹幕列表可以采取更加安全的 `insert`和`remove`函数

### insert(data:ICommentData)

### remove(data:ICommentData)
从弹幕列表中删除弹幕。注意参数data必须是同一个实例引用，否则即使参数都一样也不会导致弹幕被删除。
删除只会从时间轴中删除，如果被删除的弹幕正再播放，不会导致正在播放的弹幕消失。

### remove(filterFunction:Function)
从弹幕列表中删除弹幕。filterFunction会在每个弹幕对象上被调用。当filterFunction返回 true 
时（严格），删除相应弹幕。

### send(data:ICommentData)
把一个抽象弹幕数据对象变成一个 IComment 并放入运行列表中。当 data 对象不符合 filter 规则或者
时发送不会实现。代码弹幕也要通过send发送，只不过它们会进一步被派发到代码弹幕引擎。同一个 
ICommentData 实例如果多次用于调用这个方法会产生多个不同的弹幕实例 IComment。

注意：send可以发送不在时间轴里的弹幕。这个功能尤其利于实时弹幕的实现，因为对于直播实时弹幕，基本不
需要使用时间轴。直接把收到的弹幕 send 出去效率会高很多。

### finish(comment:IComment)
完成弹幕，从舞台删除，从空间管理器里删除。更好的方法是调用 IComment的 `finish()` 方法。一般来说
IComment的finish方法会在销毁相关的对象后调用这个方法来释放管理器内占用的资源。

## Events 事件
有几个常见的方法来管理事件。

### addEventListener(event:String, listener:Function)
添加监听器。

### removeEventListener(event:String, listener:Function)
删除监听器。

### dispatchEvent(event:String, data:Object)
派发事件。注意：派发事件可以派发自己创造的事件，比如 `dispatchEvent('myevent',null)` 在先前
有`addEventListener('myevent', function foo(){/** Foo **/})` 则会执行 foo 函数。
有一些事件会被管理器自己派发，请参考相关文档。
