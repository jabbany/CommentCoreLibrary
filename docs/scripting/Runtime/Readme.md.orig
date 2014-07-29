Runtime 运行时
=====================================
运行时（Runtime）是代码空间里面提供的一套底层API，它是用来实现影子实例同步的关键部件，和Host端的
ScriptingContext 相互配合。一般来说，如果希望是用非BSE引擎，保留Runtime依然是一个不错的选择，
因为对象注册和同步机制，还有自沙箱外派发的回调的分配，都在Runtime里实现，也很方便使用。

Runtime不是BiliScriptEngine提供的API接口，但是其作为一个底层协议性质的接口，由于实现了影子实例
所以非常有效。便于开发者调试自己的代码使用，也为未来扩展BSE提供了很多接口（包括权限与认证接口）。

Runtime分为两大主要模块，如下：

影子实例同步空间（Shadow Instance Runtime）
--------------------------------------
影子实例同步空间提供了方便影子实例和原始实例同步的一个基础框架。有关具体信息可以参考如下章节：

- [影子实例（Shadow Instances）](../Instances.md) 
- [影子架构（Shadow Instance Implementation Details）](Shadow.md)

定时器（Timers）
--------------------------------------
定时器提供了一套总控定时器，一是用于派发 enterFrame等广播事件，二是可以方便每个其余的库快速便利的
取得一个靠谱的定时器（Timer）。比如Tween库就有效的使用了 `Runtime.Timer` 进行内部控制。有关具体
API可以参考：

- [定时器（Timers）](Timers.md)
