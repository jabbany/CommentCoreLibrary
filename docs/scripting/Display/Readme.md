Kagerou Display Engine AS3接口实现
===============================================
Kagerou Display Engine 是一套通过模拟 B 站提供的元件API实现的视觉元件双向沟通与操作的API系统。
它建立了一套最底线的 AS3 接口，来供程序使用并接入。Kagerou Display Engine的命名由一套HTML5的
Flash运行空间 Smokescreen 启发。

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
    - Filter
- Shape
    - Graphics
- IComment
    - MotionManager
        -ITween

私有成员 (Private Members)
-------------------------------------------------
上述的各个类有可能存在私有类，即只能通过别的对象来进行访问。比如 TextField 的基础存在形式会是
CommentField，而 DisplayObject 则不会自行独立出现，虽然它代表了整个底层系统的视觉元件。

克隆组件 (Cloning Objects)
-----------------------------------------------
我们不鼓励使用自建的 clone() 函数去克隆一个对象，尤其是任何视觉对象，因为所有的视觉对象都有强链接
性，克隆后对副本的更改，会传达到原对象的[箱外实例 (External Instance)](../Instances.md) 导致
出现对象不同步等严重而且难以调试的问题。其中包括如下：

- 任何继承 DisplayObject 的元件
- Graphics 类
- DisplayObject 的 Transform 类
- MotionManager
- ITween （参考 [Tween](../Tween/Readme.md ）

对于数据类，克隆可能并没有那么大的影响，但是这些操作也应当尽可能避免，因为不知道何时会引发出影响。
一些疑似安全的类：

- TextFormat
- Filter
- Matrix

根对象和元对象 (Root and Meta Objects)
-----------------------------------------------
为了模拟 AS3/BSE 的根对象我们认为一切元素的 Root 是一个 Sprite（进而是一个 DisplayObject）
但是处于特殊性原因这个 Sprite 的许多功能和属性实际无法获取或设定。在这些情况下，尝试更改这些属性
则会在播放器
