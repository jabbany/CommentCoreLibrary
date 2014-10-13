# 弹幕抽象对象 IComment

在 `v1.0` 后，CommentCoreLibrary采用抽象化弹幕对象。这样便于实现不同的渲染幕布的支持，和复杂的
运动轨迹支持。在新的模式下，一个单独的弹幕管理器将可以比较容易的支持渲染到 DOM, Canvas 和 WebGL
等平面，而且支持新种类的弹幕将会非常容易。

新的变化也允许了我们抽象化空间规划模块，这样实现新的空间规划或者更改空间规划模块的模式将会变得容易到
仅需扩展数行的规划规则。同时这样也大量的削减了代码重复，提高了效率。

下面我们将介绍抽象化弹幕对象：

## Properties 属性

### LINEAR &lt;Func&gt; [静态]
LINEAR 为线形拟合函数，提供用于默认补间动画的拟合。

### mode &lt;Num&gt; = 1
Danmaku Mode: mode 表示弹幕的类型，参考 [弹幕类型 (Comment Types)](CommentTypes.md)

### stime &lt;Num&gt; = 0
Start Time: stime 表示弹幕相对于视频位置的开始时间（ms），`0`即在视频开始立即出现

### text &lt;String&gt;
Text: text 表示弹幕的文字内容。注意：在创造弹幕对象后，对 text 的更改将无意义。

### ttl &lt;Num&gt; = 4000
Time To Live: ttl 表示弹幕剩余的生存时间（ms）（注意：在css模式下该子段可能不准确）

### dur &lt;Num&gt; = 4000
Duration: dur 表示弹幕的总生存时间（ms）。默认情况下，对于滚动弹幕这个数字是 4000。

### cindex &lt;Num&gt; = -1
Pool Index: cindex 表示弹幕的弹幕池ID，用于在删除弹幕时寻找弹幕所在弹幕池。

### motion &lt;Array&lt;IMotion&gt;&gt; = []
Motion Group: motion 控制一般弹幕（CoreComment）的运动轨迹，别的类型的弹幕可能忽略此属性（如
滚动弹幕）

### movable &lt;Bool&gt; = true
Is Movable: 弹幕是否可以移动。此处为 `False` 时，弹幕的 time 函数将不会调用 update() 来移动
弹幕。这样弹幕将无动画效果（不管 motion 或者 update 函数的实现）。但是更改 `x,y` 坐标还是可以
重新定位弹幕的。

### align &lt;Num&gt; = 0
Alignment: 对齐锚点（方形四角）。此数的高位表示上下，低位表示左右。

      Byte  |  Number  |  Alignment
    -----------------------------------------
      0 0   |    0     |  Top Left (Default)
    -----------------------------------------
      0 1   |    1     |  Top Right
    -----------------------------------------
      1 0   |    2     |  Bottom Left
    -----------------------------------------
      1 1   |    3     |  Bottom Right

设定后x,y坐标的锚点将变成对应的方形角。不过，在右和下的对齐时，读取 x,y 坐标不一定准确，而且因为
效率低所以不推荐。比如 top right 模式下，读 x 坐标效率比较低，但是读 y 就要好很多。

### absolute &lt;Bool&gt; =  true
Absolute Coordinates: 是否使用绝对坐标。当 `absolute === false` 时，x,y坐标将会表示相对
于整个弹幕管理器的比例，如 `x=0.5` 在 `640 x 480` 的管理器上则会显示在 `320` 位置。

注意：width, height 总会以绝对坐标返回，所以如果需要叠加则必须手动转换到相对坐标。

### width/height/bottom/right &lt;Num&gt;
Bounding Box: 定义弹幕的宽高和下部右部位置，前两个定义了 top left 顶点，后两个定义了bottom 
right顶点。

### size &lt;Num&gt; = 25
Font Size: 弹幕的文字大小，请参考 [弹幕大小 Comment Sizes](CommentSizes.md)。更改会更新视图。

### color &lt;Num&gt; = 0xffffff
Text Color: 文字颜色，为数字表示，RGB依次由高位到低位：`0xRRGGBB`。更改会更新视图。

### border &lt;Bool&gt; = false
Display Border: 是否显示边框。用于标注新弹幕。更改会同步更新视图。

### shadow &lt;Bool&gt; = true
Display Shadow: 是否显示弹幕描边/阴影（注意：具体用哪个描边效果需要CSS控制）。更改会同步更新视图。

### font &lt;String&gt; = ""
Font Family: 弹幕字体。当设置为空字符串时，使用默认字体。更改会同步更新视图。

### parent &lt;CommentManager&gt;
Parent: 此弹幕归属的上层管理器

### dom &lt;HTMLDivElement/Canvas/etc.&gt;
DOM Correspondance: 对应的渲染元素，根据不同情况是不一样的。默认是 DIV 元素。

## Methods 方法

### constructor(cm:CommentManager, data:Object) 
构造函数，需要提供作为 parent 的 CommentManager 和用于填补属性的初始 data 对象。

### init(recycle:IComment = null)
初始化弹幕。在dom版本里面，`.dom` 对象只有在 init 后才会被创建。在 `init()` 之前也不可读取 x,y
等坐标信息（因为未初始化）。可以给一个旧的 IComment 让新的 IComment接管原来的 Comment 的 dom
对象（而不是构造新的）。当然，不提供此参数，则会创建新的渲染构件。

### time(dt:Number)
前进 dt 毫秒（ms）。当 dt 是负数时不保证支持。此函数会根据情况更新界面。CSS控制的弹幕也需要调用，
用于进行打扫。

### update()
根据 ttl 和 dur 计算弹幕位置，并渲染弹幕。不同的弹幕可以覆盖 update 函数来绘制 canvas 等。

### invalidate()
无效化缓存的弹幕空间信息。下次读取 width, height, x, y, right, bottom 强制重新计算。

### animate()
根据 motion 对象对弹幕进行补间动画。

### finish()
通知 parent 弹幕已经完结。

### toString():String
返回弹幕调试信息。


