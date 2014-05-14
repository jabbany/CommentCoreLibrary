Scripting Sandbox 代码弹幕沙箱
==================================
为了提供较高的弹幕兼容层，我们同时还在尽可能的实现代码弹幕的还原。代码弹幕通过一个基于Web Workers的沙箱
于外部的API进行通讯。这样以来即使代码弹幕含有危险代码，也不能枉自对外部的DOM进行操作（因为Web Worker与外部
仅能通过简单的信号交换通信）

Current Implementation 目前实现
---------------------------------
目前API兼容层调用位于 `$` 对象。通过对其方法的操作可以近似模拟一些类似B站/MukioPlayerPlus的代码弹幕。
目前该实现还很弱，但是发展空间不小

Supported Objects 支持的对象
--------------------------------
- $.createButton
    建造一个按钮，可以挂载 onclick 事件。
- $.createComment
    制造一条弹幕，通过参数模式动态插入 CommentManager。注意此弹幕不会出现在timeline里面，而是
    通过 send() 派发出的。注意：有时此弹幕不会被派发出，是否通过 CommentManager 渲染会根据弹幕
    的具体参数情况决定（请参考 [动态弹幕](dynamic_comment.md)）。
- $.createShape
	制造一个SVG图形
	
Support for Bili Library 兼容性库
--------------------------------
- 还原 Utils 库
    （基本都是原生方法的套用）
- 原生支持 Math 库
- 原生支持 String 库
- 支持部分 Display 库（Shape，Comment，Button等）
- 支持部分 Player 库（基本操控）
- 支持部分 Bitmap 库
- 支持部分 Storage 库
- 有限支持 Global 库（参考 [Global库](globals.md) 中的『不兼容细节』）
- 有限支持 Tween 库（参考 [Tween库](tween.md) 中的『不兼容细节』）
