错误和警告 （Errors and Warnings）
============================================
We try to replicate as much functionality as we can, but sometimes it is just 
very hard to do. In such cases we will usually silently drop the functionality
and issue a warning. If a functionality is critical to execution, it may also
raise an error or fatal error. These cases are very rare.

我们在实现兼容层时尽可能保证了还原函数库，不过有时这样做确实很难。在这些情况下，我们可能会静默的
抛弃一个方法实现，并输出一个警告。有时一个函数关乎运行的正确性时，我们才会抛出一个错误或者一个致命性
错误。

致命性错误 （Fatal Errors）
--------------------------------------------

### Syntax Error 语法错误
语法错误，比如代码结尾多了 `}` 或者不遵循 ECMAScript 标准的代码將在解析时引发致命性错误。这些
情况下你的代码將不被执行。

### Undeclared Variable 未定义对象
未定义对象对于方法会引发致命性错误。在调用方法时如果有未定义对象，或者没有很好的执行空指针检查则会
导致当前的执行空间引发致命性错误。如果此错误在回调函数中，则错误只会影响到函数本身，如果错误在你的
代码的总命名空间下，则出现错误之后的代码将不会被执行。

### Security Error 安全冲突
试图调用被禁止的函数或者没有提供正确的Key。

错误 （Errors）
---------------------------------------------
在 CCL 引擎中，有两种引发普通错误的可能性。一种是引发了内部普通错误，另一种是引发了`new Error()`
引发内部普通错误时，你的代码不会获知错误，这种情况的错误主要是由于我们API还原上的互换性问题。在这个
情况下，你的其余代码还將继续执行。

另一种错误是引发了一个 JS Exception，这有可能是引发了自建错误，也可能是引发了 CCLScripter 模拟
的错误。这种错误可以被 `try{...}catch(..){...}` 捕获，但是如果你的代码里没有进行捕获，则会变成
一个致命性错误进而阻止之后代码的运行。


警告 （Warnings）
----------------------------------------------
警告包括如下三种：

### Deprecation Warning 功能退役警告
Deprecation Warning触发应该是因为你调用了一个即将退役的函数。函数在大多数情况下还会继续返回正确
的结果，不过也有可能会失效。这些信息会在警告中给出。

### Unsupported Warning 非关键性互换性警告
Unsupported Warning是CCLScripter产生的非关键性的“未实现”警告。产生警告的函数一般会模拟一种
操作来最接近你的请求。最差的情况是函数完全没有作用。这个警告的原因可能是CCL还无法实现某个方法的还原
或者CCL自建的体系不支持该操作（如，在HTML5下并没有/尚未产生对这个函数效果的还原方法）。

### Illegal Operation Warning 非法操作警告
非法操作警告多出现于试图写入只读属性，或是试图调用非法函数，调用方法不正确等的警告。一般说明某个操作
无效，但是不会影响执行。

日志 （Log）
----------------------------------------------
日志可以通过 `trace()` 产生。有时内部函数也会 trace 自己，不过这种情况很少。用户可以关闭日志和
警告的产生，但是不能关闭错误。
