OOAPI (Out-Of API) API规制外函数
=====================

OOAPI函数是不参考 Bilibili高级脚本弹幕的部分。其中包括如下函数，我们强烈不建议对OOAPI函数进行
任何覆盖或改写。OOAPI提供了一套底层的相对安全的信息交流体系。

__trace(object:Object, traceMode:String)
---------------------
底层 trace 函数，object 为 trace 文字， traceMode 为 trace 模式：
- 'log': 普通 log，如果关闭播放器 log，则不会输出
- 'warn' : Warning 警告，告知API使用错误或Deprecate通知，关闭严格模式则不输出
- 'err' : Error 错误，永远输出。一般来说 err 表示无法纠正的错误，上一个操作可能已经失效。
- 'fatal' : Fatal 引擎错误，永远输出。一般来说一旦 trace 出 fatal错误，BScript可以终止目前的Worker实例
trace会发送到空channel，也因此无法绑定 "" 作为 channel 名称

__channel(id:String, payload:Object, callback:Function)
---------------------
底层双向通讯接口。向 id 发送 payload。如果 Channel 没有定义回调则 callback 不会被执行
否则 callback 会返回回调信息。

__schannel(id:String, callback:Function)
---------------------
底层订阅接口。订阅一个数据流。

__pchannel(id:String, payload:Object)
---------------------
底层发布接口。发布数据到一个数据流。

__achannel(id:String, auth:String, payload:Object)
---------------------
底层单向认证接口。向认证接口 id 发送认证数据串和 payload。

__OOAPI
---------------------
总控。主要功能都由上面的接管了。
