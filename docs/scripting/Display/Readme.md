Kagerou Display Engine AS3接口实现
===============================================
Kagerou Display Engine （KagerouEngine） 是一套通过模拟 B 站提供的元件API实现的视觉元件
双向沟通与操作的API系统。它建立了一套最底线的 AS3 接口，来供程序使用并接入。Kagerou Display 
Engine的命名由一套HTML5的Flash运行空间 Smokescreen 启发。

基础框架 (Basic Framework)
-----------------------------------------------
基础框架由一套底层的AS3库还原而成。继承结构如下：

- DisplayObject["DisplayObject"]
    - Sprite["Sprite"]
        - CommentButton["Button"]
        - CommentBitmap["Bitmap"]
    - Shape["Shape"]
        - CommentShape
    - TextField["TextField"]
        - CommentField

依赖关系如下：

- TextField
    - TextFormat
- DisplayObject
    - Transform
        - Matrix
        - Matrix3D
        - Vector3D
    - Filter
        - Matrix
- Shape
    - Graphics
- Sprite
    - Graphics
- IComment
    - MotionManager
        - ITween

私有成员 (Private Members)
-------------------------------------------------
上述的各个类有可能存在私有类，即只能通过别的对象来进行访问。比如 TextField 的基础存在形式会是
CommentField，而 DisplayObject 则不会自行独立出现，虽然它代表了整个底层系统的视觉元件。

同时由于JS没有标记private的能力，很多私有属性会可以访问。我们非常不建议对这些树形进行直接更改，
因为那会导致与沙箱外产生不同步，同时也不能保证在其他的环境下同样操作依然可行。大部分私有属性都带有
“_” 预置下划线（Prefix Underscore）。

克隆组件 (Cloning Objects)
-----------------------------------------------
我们不鼓励使用自建的 clone() 函数去克隆一个对象，尤其是任何视觉对象，因为所有的视觉对象都有强链接
性，克隆后对副本的更改，会传达到原对象的[箱外实例 (External Instance)](../Instances.md) 导致
出现对象不同步等严重而且难以调试的问题。其中包括如下：

- 任何继承 DisplayObject 的元件
- Graphics 类
- DisplayObject 的 Transform 类
- MotionManager
- ITween （参考 [Tween](../Tween/Readme.md) ）

这些类在克隆后，副本会依然与克隆主体绑定。而克隆出的两个副本还会产生数据不同步问题。如下：

    var a = clone((new CommentField("f1")).transform);
    var b = clone(a);
    var m1 = new Matrix();
    var m2 = new Matrix();
    // a,b 为不同对象实例，但是绑定了同一个 CommentField
    a.matrix = m1;
    // 此时 CommentField 的变换Matrix是 m1， a.matrix == m1，b.matrix != m1
    b.matrix = m2;
    // 此时 CommentField 的变换Matrix是 m2， a.matrix == m1，b.matrix == m2
    // a.matrix !== b.matrix
    // 此时 b 是 CommentField 的真实 transform，而再次读取 CommentField 的
    // transform属性將返回错误的transform信息 

注意这里我们 clone 的是 `Transform` 而不是 Matrix。克隆 Matrix 可以通过 Matrix 自带的 
`clone()` 方法。

对于数据类，克隆可能并没有那么大的影响，但是这些操作也应当尽可能避免，因为不知道何时会引发出影响。
一些疑似安全的类：

- TextFormat
- Filter (GlowFilter, BlurFilter etc.)
- Matrix (Matrix3D, Vector3D, Point etc.)

根对象和元对象 (Root and Meta Objects)
-----------------------------------------------
为了模拟 AS3/BSE 的根对象我们认为一切元素的 Root 是一个 Sprite（进而是一个 DisplayObject）
但是处于特殊性原因这个 Sprite 的许多功能和属性实际无法获取或设定。在这些情况下，尝试更改这些属性
则会在播放器的影子对象上被抛弃。

元对象（Meta Object）是一个虚拟的对象用来绑定监听事件等的，这些对象无法被移除，同时负责监听来自
沙箱外的事件（如键盘鼠标事件和网络事件）。

对象唯一的ID (Unique Identification)
-----------------------------------------------
为了实现影子实例和强绑定，每一个需要影子的对象都会保存它或者它的父对象的一个唯一的识别符。这个识别符
由 `Runtime` 获得。继承 `DisplayObject` 的对象都会允许你通过 `getId()` 获取这个值。ID相同
的两个对象是强绑定在同一个外部对象上的，可以认为对二者的操作会产生相同的效果。

卸载对象 (Unloading Objects)
-----------------------------------------------
DisplayObject 都有一个 `unload()` 方法，该方法是用于**消除影子对象的**。一旦调用，则会通告
沙箱外此对象已经废弃不要。调用`unload()` 后的 DisplayObject如果进行更改属性或者调用方法的话
会导致沙箱外无法找到对应的影子对象而产生警告和/或错误。当然还有很小的可能性是，新的一个
DisplayObject 取得了原来被删除的对象的ID。这可能会导致不可预期的错误。所以请把对象的 unload
操作留给 Runtime 去做。

如果希望消除对象但不卸载，可以使用 `o.parent.removeChild(o)` 或者 `o.remove()`。注意：
在普通的舞台对象，`o.parent`是null的，所以需要 `o.root.removeChild(o)` 或者 `$.root.removeChild`
但是在 `o.remove()` 函数下则以已经帮你考虑到了，直接调用即可。

