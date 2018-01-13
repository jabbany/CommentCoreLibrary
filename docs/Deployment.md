# Deployment 部署 CCL
CommentCore 主体包括：
- CommentManager 弹幕管理器（用于控制弹幕）
- CommentSpaceAllocator 弹幕空间规划器（用于排版弹幕）
- IComment:CoreComment/ScrollComment 弹幕对象（可以自己扩展实现更多弹幕类型）

KagerouEngine 引擎包括：
- Host (OOAPI) 接受与呈现端
- Sandbox (OOAPI) 代码沙箱与BiliScript运行时

## 组件功能 Functionality
CommentCore主体可以进行：
- 弹幕呈现和空间规划（滚动、逆向、顶部、底部、高级定位、高级移动）
- 弹幕过滤
- 实时弹幕支持

KagerouEngine 用于呈现原版类似 BiliScript 的脚本代码弹幕

如果不需要代码弹幕支持，只需要部署 CommentCore 部分。对于仅需要对代码沙箱支持的，
也可以直接使用 KagerouEngine （它对 CommentCore 部分没有依赖）。如果希望进行完整还原的，
可以参考下面合体配置方法章节。

## 架设 CommentCore 主体
CommentCore 主体分为两个重要部分：CSS和JS。在编译后，分别位于`dist/css/style.css` 和
`dist/CommentCoreLibrary.js`。使用时必须保证引用了两个文件（或者在项目中已经合并入两个文件的
代码），尤其要注意CSS不能没有。

## 架设 KagerouEngine 引擎
KagerouEngine分为两个部分：JS Host和Worker Client。在编译后，分别位于
`dist/scripting/Host.js` 和 `dist/scripting/Worker.js`。架设时，只需在外部引入
`Host.js` 然后把 `Worker.js` 的位置，在初始化 `Host` 时传递进入即可。`scripting/` 目录的
结构关系需要保护，以免 Worker 无法载入相应的需要的运行时库。

### 合体配置方法
目前的合体方法是把 `CommentManager.scripting` 赋值成 Scripting Host 生成的 Sandbox实例
即可。未来会有专门的方法和事件供挂载。
