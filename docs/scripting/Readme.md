# Kagerou Engine 代码弹幕“阳炎引擎”

![Diagram](Scripting-Diagram.png?raw=true)

KagerouEngine 是一套在最大可能的程度上兼容原版 Bilibili 代码弹幕语法和环境的安全的高层接口。
它建造于 OOAPI 底层API之上，并通过 OOAPI 与显示端进行通讯。受益于这种隔离，我们可以在
KagerouEngine 中运行相对不受信任的脚本弹幕而不影响整个网站的安全。

注意：新版 Bilibili 引擎
[Blibili Animation Script](https://github.com/Bilibili/bas) 采用了新的不基于
ECMAScript 语法的语言。目前虽然已经推行的功能相较原版引擎有非常多的限制（很多并没有提升安全性）
但是由于是开发中的语言，还会不断更新。在本文当中，我们采用 BiliScriptEngine (BSE) 来表示
旧版引擎， BAS 来代表新版引擎。

KagerouEngine API is a set of high-level secured APIs that are modeled after
the Bilibili video player scripting engine. It is build atop the OOAPI
transmission layer and uses it alone to communicate with the player to perform
operations. With this design we are able to run otherwise untrusted JavaScript
code in a controlled environment.

Note: In late 2017 Bilibili implemented a new scripting engine,
[Blibili Animation Script](https://github.com/Bilibili/bas). This engine does
not use a dialect of ECMAScript. Although the new engine is significantly
limited in terms of functionality (with few security benefits), it is still
in development. In this documentation, we will refer to the old scripting engine
ase BiliScriptEngine (BSE) and the new one as BAS.

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

KagerouEngine aims to be a drop-in replacement for BSE, however due to the way
we implement things, there may be some differences when actually used. Please
refer to [Differences](Differences.md) for a more detailed description of things
that may work differently or not at all.

## Alternative Engines 别的代码弹幕引擎
虽然说阳炎引擎是CommentCoreLibrary自带的代码引擎，但是它不是唯一一个可以和 CCL 协作的代码
引擎。实际上，现在已经有若干代码弹幕运行时可以和CCL衔接用来替换 KagerouEngine。这些引擎
（包括KagerouEngine）都有各自的利弊，开发者可以根据自己的需求选用。

While KagerouEngine is provided as a part of CommentCoreLibrary, it is not the
only engine that will work with CCL. In fact there are many scripting engines
that can be (to varying degrees) used as a replacement for KagerouEngine. These
offer different benefits and drawbacks.

Here is a list of them:

- [Bilibili Animation Script](https://github.com/Bilibili/bas) by @DIYGod

    New version of the scripting language used by Bilibily as of late 2017.
    It is syntactically and feature wise different from previous
    implementations.

- [Bulletproof](https://github.com/hozuki/Bulletproof) by @hozuki

    More efficient code danmaku with Canvas and WebGL acceleration on a better
    implemented AS3 shim. However, this engine does not provide any sandboxing.

- [Sebas](https://github.com/hozuki/sebas) by @hozuki

    Open source implementation of BAS. Currently stalled but could be useful if
    you want a good starting point with a good license.

- [GAS](https://github.com/OpenDanmakuCommunity/gas)

    Community run new language for advanced comments. Possibly can be compliled
    to from BAS etc.
