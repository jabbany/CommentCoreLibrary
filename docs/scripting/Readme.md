CCLScripting API 定义 (API Definitions）
===========================

CCLScripting 是一套在最大可能的程度上兼容Bilibili代码弹幕语法和环境的安全的高层接口。
它建造于 OOAPI 底层API之上，并通过 OOAPI 与显示端进行通讯。受益于这种隔离，我们可以在 
CCLScripting 中运行相对不受信任的脚本弹幕而不影响整个网站的安全。

CCLScripting API is a set of high-level secured APIs that are modeled after
the Bilibili video player scripting engine. It is build atop the OOAPI 
transmission layer and uses it alone to communicate with the player to perform
operations. With this design we are able to run otherwise untrusted JavaScript
code in a controlled environment.

沙箱局限性 (Sandbox Limitations）
----------------------------

沙箱并不是完美的，它在很多方面提供了更多的可控性，其中之一就是可以直接派发 XMLHttpRequest 请求。
由于这种请求依然被同域策略限制，请求只能访问Scripting的载体服务器。为了保证安全，你可以在一个子域
或者另一个根域名下放置脚本代码引擎，避免你的主服务器被请求。不过值得注意的是，代码依然可以访问外部的
开放资源，同时也可以借此把需要的信息向外部传递。当然，可以获得的信息仅限于通过 OOAPI 派发来的信息
而已。

A worker sandbox is not perfect. Scripts running inside still have access to the
potentially dangerous XMLHttpRequest API. To limit scripts' access to your own
domain, you can choose to host the worker files on a separate subdomain or 
domain since the Same Origin Policy is still in effect for workers. This, 
however, does not prevent the Script from sending out data to a server controlled
by a third party. The Script within the worker context only has as much data as 
you feed it through the OOAPI. So it is possible to control data leakage too.

兼容性挑战 （Compatibility Issues）
-----------------------------

由于沙箱是建立在 信息传递（Messaging API） 基础上的，我们只能可靠的进行单向信息汇报。我们无法在
这个API下实现可靠的阻塞式双向信息传递，所以在沙箱内的许多功能將依赖沙箱外界发来的状态报告。 

我们举例如下：

Player开放了许多可以用来读取播放器状态的接口，比如 `Player.time`, `Player.state` 等。由于我们
无法在脚本读取这些属性是现去请求外部，所以我们必须使用缓存的数据。即，外部定期会同步状态到沙箱内
而更细的信息则会被沙箱脑补。比如当播放器传来 Play/Timeupdate信息时，`Player`会更新内部的状态信息
而在第二个消息到来前，读取各种状态则会被`Player`脑补。

如果 `Player.state` 在播放中状态，那么在两个 `timeupdate` 之间，读取`Player.time`则会返回上次的 
`playtime + 从上次timeupdate 到现在所经过的时差`。

同样， 由于无法高效获取外部的刷新率，`enterFrame`事件的广播则会完全由沙箱内部接管。不过这个广播的
派发频率可以由 `$.frameRate` 调整。更加详细的区别会在各个API接口处表示出来。

Due to the CCLScripting Engine using only the messaging API. We cannot reliably
ask for synchronous state information and expect a prompt reply. This means that 
we must use cached information at times. 

Whenever we resort to using cached information due to a synchronous API, we will
try to compensate the diffence in cache if possible. For example, within the 
`Player` api, there are many properties that show information about the player's
state. Most of these fields are cached. As a specific example, `Player.time` is 
updated whenver a timeupdate is issued into the sandbox. Between the two issued
timeupdates, requesting for `Player.time` will return you the previous timestamp
plus the difference in time between when you recieved it and the current time.

This may cause the time to slightly decrease as timeupdates are recieved.

Similarly, the broadcast event 'enterFrame' is also completely virtual as it is
not efficient enough to send drawing state into the sandbox at high frequencies. 
More details on these compatibility problems are described in the corresponding 
API docs.

