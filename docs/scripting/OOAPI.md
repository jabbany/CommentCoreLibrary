OOAPI (Out-Of API) API规制外函数
=====================

OOAPI函数是不参考 Bilibili高级脚本弹幕的部分。其中包括如下函数，我们强烈不建议对OOAPI函数进行
任何覆盖或改写。OOAPI提供了一套底层的相对安全的信息交流体系。

注意：OOAPI提供的是信息传递层，并不是保障安全的措施。在非Worker条件下也可以通过模拟 OOAPI 提供的
API来实现同样的（没有沙箱保护的）脚本功能。在沙箱内，OOAPI也不能保证恶意的脚本不去调用系统提供的
postMessage 等函数。OOAPI仅仅是辅助内部库标准化开发的一个部件。安全是由OOAPI的外端Host
载体脚本对收到的信息进行辨别，Worker沙箱隔绝DOM，和对不可信沙箱message采取安全处理方式确保的。

注意：不要手误打成 OPPAI，OOAPI有两个O，一个P！

__trace(object:Object, traceMode:String)
---------------------
底层 trace 函数，object 为 trace 文字， traceMode 为 trace 模式：
- 'log': 普通 log，如果关闭播放器 log，则不会输出
- 'warn' : Warning 警告，告知API使用错误或Deprecate通知，关闭严格模式则不输出
- 'err' : Error 错误，永远输出。一般来说 err 表示无法纠正的错误，上一个操作可能已经失效。
- 'fatal' : Fatal 引擎错误，永远输出。一般来说一旦 trace 出 fatal错误，BScript可以终止目
前的Worker实例

trace会发送到空channel，也因此无法绑定 "" 作为 channel 名称

__channel(id:String, payload:Object, callback:Function)
---------------------
底层双向通讯接口。向 id 发送 payload。如果 Channel 没有定义回调则 callback 不会被执行
否则 callback 会返回回调信息。

__schannel(id:String, callback:Function)
---------------------
Subscribe channel. 底层订阅接口。订阅一个数据流。

__pchannel(id:String, payload:Object)
---------------------
Post channel. 底层发布接口。发布数据到一个数据流。

__achannel(id:String, auth:String, payload:Object)
---------------------
Authenticated channel. 底层单向认证接口（和同名番剧没有关系）。
向认证接口 id 发送认证数据串和 payload。

__OOAPI
---------------------
总控。主要功能都由上面的接管了。默认实现提供了 `createChannel`, `deleteChannel` 和 
`addListenerChannel` 等方法。并非所有的OOAPI实现都会提供，所以内部的库并不会依赖访问OOAPI
对象的功能的。
