Transmission API
=====================================
这里定义了传输 API

Worker &rarr; CCLScriptingContext
-------------------------------------
- CleanUp
    Requests the cleanup of a worker. This signals that the worker is finished 
    all tasks and should not be used again. We assume all resources are freed.
    请求清理一个高级弹幕运行沙箱。此信号表示沙箱将不会在被使用并且取消CCL执行空间对沙箱的管理。
    我们默认在这时所有此沙箱的变量都已经无效化并且被释放。

- Trace
    Sends a request for Trace output to the CCLContext. 发送调试信息到 CCLContext。
    一个外部的监听器可以接受到所有此类信号。主要由 Trace 函数发送，用户也可以重载让别的函数发送。

- AssignObject
    Registers an object id, class and abstraction on the CCLContext. This is used
    to actually initialize DOM elements and the such. IDs correspond to the same
    IDs in the worker.
    注册一个对象
