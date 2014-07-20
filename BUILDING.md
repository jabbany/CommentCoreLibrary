Building 编译项目
==============================
本项目采用 grunt 管理编译，有关 Grunt 系统的使用请参考[官方文档](http://gruntjs.com/getting-started)
脚本弹幕部分的编译还需要 [TypeScript](http://www.typescriptlang.org/) 。这些库还会依赖于
NodeJS环境。

### 确定你是否需要编译 （Do I need to build CCL?）
CommentCoreLibrary在库外提供了很多可扩展的空间，你可以相对简单的增加新的弹幕格式的支持，新的弹幕
运行模式的支持和挂载各种不同的定时元件。CCL提供了丰富的扩展支持，通过预处理过滤器和运行时过滤器可以
实现非常多的特殊功能支持。编译库意味着你可能需要一些默认环境没有的软件，比如 NodeJS 平台，为此需要
付出一些架设精力。

当然自己编译也会带来一些优势，比如更小的库大小和更加专注的功能支持。还有，希望帮助CCL实现更多支持的
开发者们也需要知道如何有效的编译。

### 配置编译环境（Setup Build Environment）
初次编译请确保你安装了 `node>=0.8.0`，为全局系统安装 grunt 请执行：

    npm install -g grunt-cli

有些系统下可能需要管理员权限（如 `sudo`）。有关具体如何配置Grunt请参考官方文档。

接下来你需要安装编译所需的库，可以简单的通过 `npm install` 进行安装。CommentCoreLibrary在
运行时没有任何依赖关系，但是开发环境需要依赖 grunt 的一些部件和 TypeScript（参考下面“代码弹幕”
章节）。

### 编译（Building）
编译项目请在根目录直接运行：

    grunt

即可按照默认模板编译。除此之外，你还可以改变编译目标：

- build ： 只编译项目，不会clean掉 build文件夹下的产物
- build-core ： 只编译弹幕核心，不包括Acfun和Bilibili的解析器。这个更加适用各种二次开发不需要
    已有的弹幕格式的

默认模式会自动看管 `src` 源码文件夹，并且在产生变化的时候自动生成新版。

### 调试（Debugging）
本地调试的话，可以在本地架设Web Server。默认的 `demo` 文件夹下也有一套简易的调试界面。同时你还
可以参考这个界面来实现你自己的嵌入调试。

### 代码弹幕（Scripting Engine）
默认的代码弹幕支持需要使用 TypeScript 编译。这需要你安装 TypeScript 支持，通过 
`npm install -g typescript` 即可安装。代码弹幕部分临时还在使用旧的 `make` 系统，未来也会
逐渐过渡到使用 Grunt。目前编译项目不会引入代码弹幕支持（考虑到架设难度的增高和潜在受众面相对于
弹幕支持要少一些），相关库需要手动引入。

参考 `docs/scripting` 了解代码弹幕系统和它的编译方法。
