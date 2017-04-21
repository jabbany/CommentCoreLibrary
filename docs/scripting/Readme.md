# Kagerou Engine 代码弹幕“阳炎引擎”

![Diagram](Scripting-Diagram.png?raw=true)

KagerouEngine 是一套在最大可能的程度上兼容Bilibili代码弹幕语法和环境的安全的高层接口。
它建造于 OOAPI 底层API之上，并通过 OOAPI 与显示端进行通讯。受益于这种隔离，我们可以在 
KagerouEngine 中运行相对不受信任的脚本弹幕而不影响整个网站的安全。

KagerouEngine API is a set of high-level secured APIs that are modeled after
the Bilibili video player scripting engine. It is build atop the OOAPI 
transmission layer and uses it alone to communicate with the player to perform
operations. With this design we are able to run otherwise untrusted JavaScript
code in a controlled environment.

## Design 设计思路

To be written

### Native OOAPI
[OOAPI](OOAPI.md) is a set of internal methods that allow creating different
scripting engines that are sandboxed. KagerouEngine is one example of such
an engine that uses sandboxing.


## Object References 接口定义
- [Display](Display/)
- [Player](Player/)
- [Runtime](Runtime/)
- [Tween](Tween/)
- [Utils](Utils/)

## Differences to BiliScriptEngine 与 BSE 的区别

KagerouEngine aims to be a drop-in replacement for BSE, however due to the way we implement things, there may be some
differences when actually used. Please refer to [Differences](Differences.md) for a more detailed description of things
that may work differently or not at all.

## Alternative Engines 别的代码弹幕引擎
虽然说阳炎引擎是CommentCoreLibrary自带的代码引擎，但是它不是唯一一个可以和 CCL 协作的代码引擎。实际上，现在已经有若干代码弹幕运行时可以
和CCL衔接用来替换 KagerouEngine。这些引擎（包括KagerouEngine）都有各自的利弊，开发者可以根据自己的需求选用。

While KagerouEngine is provided as a part of CommentCoreLibrary, it is not the only engine that will work with CCL. In
fact there are many scripting engines that can be (to varying degrees) used as a replacement for KagerouEngine. These
offer different benefits and drawbacks.

Here is a list of them:

- [Bulletproof](https://github.com/hozuki/Bulletproof) by @hozuki
    
    More efficient code danmaku with Canvas and WebGL acceleration on a better implemented AS3 shim. However, this
    engine does not provide any sandboxing.
