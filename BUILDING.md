Building 编译项目
==============================

When building the comment core library, you can build two different types, 
the minified or non minified.

编译模块的时候，可以选择编译成两种不同的单文件。压缩版，和非压缩版。

The default is to build a minified version （我们默认会编译成压缩版，通过如下命令）:

    make
    
or

    make all-uglify

Minifying the JavaScript requires you to have Node.js installed. 压缩输出文件要求你
有安装了Node.js。

If you want a non-minified single file version, use （下面的命令则会输出一个未经压缩的
只有堆砌起来的文件）:

    make all-concat-only

Separate Components 分模块编译
-----------------------------
To build each module separately, run `make all`. It will produce 2 parts, parsers
and the CommentCoreLibrary. 如果希望弹幕编译每个模块，运行上方命令，会产出两个部件，一个是CCL
弹幕库，另一个是解析库。

You can also run `make extensions` to build all the experimental extensions. They
will not be minimized. 你还可以编译正在实验中的一些扩展模块，这些模块不会被压缩以方便调试。
