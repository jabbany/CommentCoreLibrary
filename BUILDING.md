# Building 编译项目

本项目源码使用 [TypeScript](http://www.typescriptlang.org/) 编写，通过
[Rollup](https://rollupjs.org/) 和 [SWC](https://swc.rs/) 编译为 ES5 代码（兼容旧版浏览器）。
TypeScript 本身只负责类型检查。开发环境需要 NodeJS 和 [pnpm](https://pnpm.io/)。

### 确定你是否需要编译 Do I need to build CCL?
CommentCoreLibrary在库外提供了很多可扩展的空间，你可以相对简单的增加新的弹幕格式的支持，新的弹幕
运行模式的支持和挂载各种不同的定时元件。CCL提供了丰富的扩展支持，通过预处理过滤器和运行时过滤器可以
实现非常多的特殊功能支持。编译库意味着你可能需要一些默认环境没有的软件，比如 NodeJS 平台，为此需要
付出一些架设精力。

当然自己编译也会带来一些优势，比如更小的库大小和更加专注的功能支持。还有，希望帮助CCL实现更多支持的
开发者们也需要知道如何有效的编译。

### 配置编译环境 Setup Build Environment
初次编译请确保你安装了 NodeJS（版本参考 `package.json` 中的 `engines`）以及 pnpm，
然后在根目录执行：

    pnpm install

CommentCoreLibrary在运行时没有任何依赖关系，开发环境的依赖都会被自动安装。

### 编译（Building）
编译项目请在根目录直接运行：

    pnpm build

即可清空并重新生成 `dist/` 目录下的全部产物。除此之外，你还可以改变编译目标：

- `pnpm build:core` ： 只编译弹幕核心（包括 CommentProvider、过滤器和各种解析器）以及 CSS
- `pnpm build:scripting` ： 只编译代码弹幕支持（`dist/scripting/`）
- `pnpm watch` ： 看管 `src` 源码文件夹，并且在产生变化的时候自动重新编译

编译产物 Build outputs:

- `dist/CommentCoreLibrary.js` (`.min.js`) ： UMD 格式，支持 AMD (RequireJS)、CommonJS
    以及直接通过 `<script>` 引用。直接引用时会创建全局 `CommentCoreLibrary`，同时为了兼容旧版
    也会把 `CommentManager`、`BilibiliFormat` 等导出为同名全局变量。
- `dist/CommentCoreLibrary.mjs` ： ES Module 格式，供 webpack / Rollup / Vite 等打包工具使用
- `dist/types/` ： TypeScript 类型声明
- `dist/css/style.css` (`.min.css`) ： 样式表（自动添加浏览器前缀）

所有 JavaScript 产物都必须是 ES5 代码，可以通过 `pnpm check:es5` 验证。

### 测试（Testing）

- `pnpm typecheck` ： TypeScript 类型检查
- `pnpm test` ： 对源码运行测试（[Vitest](https://vitest.dev/) + jsdom）并生成覆盖率报告
    （`coverage/` 目录下，含 HTML 和 lcov 格式）
- `pnpm test:dist` ： 对编译产物运行同样的测试，并测试各种模块系统和代码弹幕的 Worker 脚本
    （需要先编译）
- `pnpm verify` ： 依次执行编译和以上全部检查（持续集成使用）

### 调试（Debugging）
本地调试的话，可以在本地架设Web Server。默认的 `demo` 文件夹下也有一套简易的调试界面。同时你还
可以参考这个界面来实现你自己的嵌入调试。

### 代码弹幕（Scripting Engine）
代码弹幕支持分为两部分，都通过 `pnpm build:scripting` 编译：

- `dist/scripting/Host.js` ： 运行在页面中的宿主部分（UMD 格式，全局变量 `CCLScripting`）
- `dist/scripting/Worker.js` 和 `dist/scripting/api/` ： 运行在 Web Worker 中的沙箱部分。
    `api/` 下的每一个模块（Runtime、Tween、Display、Player、Utils）都由
    `src/scripting/api/<模块>.ts` 编译为一个独立的脚本，并创建同名的全局变量。
    模块之间只能通过 `import * as Runtime from '../Runtime/Runtime'` 的方式相互引用，
    且只能引用在 `Worker.js` 中先加载的模块。

参考 `docs/scripting` 了解代码弹幕系统。
