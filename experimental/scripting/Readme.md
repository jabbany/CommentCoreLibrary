Scripting
===================================

The scripting module is no longer experimental. It is now in the main branch. 
The demo/corresponding tests are now in demo/scripting and spec/dist (with
test data in spec/fixtures/scripting).

The following unfinished work is kept here for reference. None of it is built,
type checked or tested:

- `deprecated/`: the scripting engine that came before KagerouEngine.
- `host-ts/`: an unfinished TypeScript rewrite of the scripting host. The
    shipped host (`dist/scripting/Host.js`) is still built from
    `src/scripting/Host.js` and `src/scripting/Unpacker.js`.
- `external/`: libraries meant to be loadable from scripts through `load()`.
    They were never built into `dist/scripting/`, and some are only stubs.

代码弹幕支持
===================================
代码弹幕支持功能已经脱离“实验性”分支，并被纳入了主线研发。有关的demo和测试，在 demo/scripting
和 spec/dist 文件夹里（测试数据在 spec/fixtures/scripting）。

以下未完成的工作仅作参考保留，不参与编译、类型检查和测试：

- `deprecated/`：KagerouEngine 之前的代码弹幕引擎。
- `host-ts/`：未完成的代码弹幕宿主 TypeScript 重写。实际发布的宿主
    （`dist/scripting/Host.js`）仍由 `src/scripting/Host.js` 和 `src/scripting/Unpacker.js` 编译。
- `external/`：计划通过 `load()` 在代码弹幕中加载的扩展库。它们从未被编译进 `dist/scripting/`，
    部分只是空壳。
