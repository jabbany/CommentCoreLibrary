Timers 定时器
=============================
Runtime的另一项重要功能就是控制定时器。在Runtime下有两种定时器：

定时器运行时（TimerRuntime）
------------------------------
定时器运行时是一个可以派发定时器的定时器。在它上面可以绑定一系列更小的定时器，包括两种常见定时器：
timeout（延时）和interval（重复）。

在Runtime里面有一个TimerRuntime的实例，它管控了整个系统的定时器，如 `Utils.timeout`。这些
小型定时器注册到了大的TimerRuntime上。如果暂停了TimerRuntime，那么所有挂载的定时器就暂停了。

定时器（Timer）
------------------------------
独立定时器是运行于定时器运行时以外的定时器。它主要操作了Tween库，也有负责派发 enterFrame 等事件
的实例。Timer们自己包括了定时器对象，提供暂停和event。注意：根据配置，`Utils.interval`也可能会
返回一个Timer实例。在这情况下，对TimerRuntime进行暂停则不会影响 `Utils.interval`。

这个设计思维取自 biliscript-syndicate 对 interval 表现的叙述的还原。
