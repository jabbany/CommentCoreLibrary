Utilities 工具箱
===================================
Utils模块支持了许多Biliscript的自带静态方法。以下我们將尽可能详细的介绍这些API。其中大部分都有
相应的 JSDoc。

rgb(r:number, g:number, b:number):number
-----------------------------------
转换 rgb 数值到一个一体化的 rgb 数字。

hue(h:number, s:number = 1, v:number = 1):number
-----------------------------------
转换 HSV 到一个RGB数字。默认情况下 saturation 和 brightness（value）都取 `1`，效果与
Biliscript公共API的hue函数一致。在CCL下我们还允许你更改饱和度和亮度。

formatTimes(time:number):string
-----------------------------------
把秒 `ssss` 转换成 “分钟：秒”字符串。注意此转化不带小时，即时间足够大的时候，会显示 "61:01" 
等等。

distance(x1:number, y1:number, x2:number, y2:number):number
-----------------------------------
给出两个点的坐标，计算出其距离差。

rand(min:number, max:number):number
-----------------------------------
给出整数最小值和最大值，返回一个在这个区间内的随机整数。如果min非整数，则会导致所有的输出包含于min
小数部分相同的小数。

getTimer():number
-----------------------------------
返回从本库的Worker线程载入起，到现在经历的总时间差（毫秒）。仅为兼容性存在，其实也可以用
`Date.now()` 进行时间的精确测量。

timer(callback:Function, delay:number = 1000):number
-----------------------------------
延时 delay 毫秒后呼叫 callback。

interval(callback:Function, interval:number = 1000, repeat:number = 1):number/Runtime.Timer
-----------------------------------
产生一个定时器，在每interval毫秒时呼叫callback，重复进行repeat次。如果repeat是0，则无休止
进行下去。在一些情况下可能会返回一个 Runtime.Timer 实例，也可能会返回一个整数。

Timers & Delays 定时器和延时
===================================
有关定时器和延时的工作方式，请参考 [Runtime/Timers](../Runtime/Timers.md) 章节。简而言之，
一般的timer函数会挂在到主线计时器内，这样可以方便消除。当interval返回一个数字时，他也绑定到了主线
计时器下，也可以被外部暂停或者消除。

但是当一个 interval 产生了一个 Runtime.Timer 对象实例的时候，主线计时器就没有对其的管理权了，
系统提供的计时器卸除和全空间暂停事件將不会影响计时器的继续运作。
