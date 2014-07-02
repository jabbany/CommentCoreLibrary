Globals 库
================================
Globals库用于保存全局变量，这样就能实现跨空间读取。但是由于我们的沙箱架构，跨空间读取信息本身就有
一定的限制。同时由于 Globals 支持可能带来一些开销，一些实现可能会禁止 Globals API。我们强烈建议
开发者们 **不要依赖Globals库**。

._set (key, value)
---------------------------------
设定一个 Key 为 Value。

._get (key)
---------------------------------
获取一个 Key 下存储的 Value

不兼容细节
---------------------------------
首先，由于通讯协议的限制，每次更改变量必须通过 ._set 重新更改全局变量，因为全局的变量和 Worker 实例
里面 Globals 库缓存的变量是不一样的，同样，期待产生变化的话必须通过 ._get 重新载入。举例如下：
WorkerA

    var x = Globals._set("a", {b:10, c:11});
    trace(x.b); // = 10
    x.b = 20;
    trace(x.b); // = 20
    trace(Globals._get("a").b) // = 10
    Globals._set("a",x);
    trace(Globals._get("a").b) // = 20

我们再考虑在 A 同时运行的 B 代码：
WorkerB

    var x = Globals._get("a");
    // 在 A 的第二个 _set 之前
    trace(x.b) // = 10
    // 假如这时 WorkerA 更改了 Globals 中的 a
    trace(x.b) // = 10
    trace(Globals._get("a").b) // = 20
    
换句话说，每次对 _set 或者 _get 的调用就是同步变量。如果希望保险的话，可以不去把结果赋值，而是
每次懂 _get 一遍。由于变量是缓存的，这并不会非常影响效率。

其次，由于通讯必须通过 JSON 化，所以无法传递函数或者状态信息到对方。于是 Globals 库会采取如下措施：
对于

    w = {
        doSomething:function(){
            // some code
        }
    }
    
我们会首先打包 `doSomething` 函数为一个对象，然后更改变量名为 "__f:doSomething":

    w = {
        "__f:doSomething":"function(){ /* some code */ }"
    }
    
并且在对 get 时侧解包，并且 eval 出函数，赋值。这里需要注意两点，由于解包时所在的环境不同，函数
可能会失去一些本可以访问的对象，所以在编写时请不要依赖任何变量存在，因为我们不能引入别的变量。如果
你希望链接 `w` 本体（如使用 `w.otherParameter = 'something'` ），则需要在所有提到 `w` 的时候
使用 `__unpack_self` 来引用（所以创建变量的时候也最好采取同样名称，如果还需引入自己的话）。



    
