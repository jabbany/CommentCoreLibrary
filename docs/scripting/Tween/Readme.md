# Tween Libraries Set 补间动画支持库
Tween Libraries Set是一套尽可能还原支持B站原有补间动画的补间动画库集合。它可以由Tween库进行
访问。

目前支持尚不完整，支持如下的补间：

- tween 普通补间
- to 无起点补间
- scale 缩放补间
- delay 延时启动
- reverse 反播补间
- repeat 多次播放补间
- slice 播放补间的一部分
- serial 串联补间动画
- parallel 并联补间动画
- bezier 曲线补间


## 补间函数 Easing
说到补间，就必须有补间函数。补间函数形如 `easing(time, begin, change, duration)`。每个
参数的功能如下：

- `time`, `duration`: 决定动画播放的位置。`time` 是一个在 `0-duration` 之间的数字。
- `begin`, `change` : 决定补间处理的属性的值域。`begin` 为 `time=0` 时的取值，
    `begin + change` 为 `time=duration` 时的取值。

基本函数结构如下：

```
param = fn(time / duration) * change + begin
```
具体支持如下函数：

- linear 线性补间
- quadratic 平方补间
- cubic 立方补间
- quartic 四次方补间
- quintic 五次方补间
- circular 圆形补间
- sine 三角函数补间
- exponential 幂补间

函数图像参考： [easings.net](http://easings.net/)
所有函数都以 Ease in out 给出（同时作为进入和退出补间）
