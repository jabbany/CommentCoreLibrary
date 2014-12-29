# Readme 文档

CCL包括一套尽可能完备的文档来帮助二次开发。文档主要针对两个部分：各种东西都是什么，各种东西都应该
怎么用。如果想看看现实里使用了 CCL 的项目，可以参考 [Powered By CCL](PoweredByCCL.md) 里面
的不完全收录。

## 入门文档（Introduction）
想开始对 CCL 的开发却还不太了解 CommentCoreLibrary？希望在自己的项目里使用 CCL 却不熟悉接口？
赶紧来看[入门文档](Intro.md)

### 部件参考（Individual Parts）

- [CommentManager 弹幕管理器](CommentManager.md)
- [CommentObject 弹幕对象](CommentObject.md)

### 使用方法参考（Customization）
理论上CCL兼容的功能非常之多，但是并不是所有的功能都在库中有实现，有关实现一些效果的较好的做法，请参考
[DoingItRight 推荐使用方法](DoingItRight.md)。里面介绍了如何优雅的实现大部分现有弹幕站点的一些
附加功能，包括实时弹幕，弹幕显示格式切换，调整运动速度，全屏同步大小等等。

## 如何架设（How to Deploy）
CommentCoreLibrary主要包括两个部分，CommentCore主体和KagerouEngine代码弹幕支持引擎。

CommentCore主体包括：
- CommentManager 弹幕管理器（用于控制弹幕）
- CommentSpaceAllocator 弹幕空间规划器（用于排版弹幕）
- IComment:CoreComment/ScrollComment 弹幕对象（可以自己扩展实现更多弹幕类型）

KagerouEngine引擎包括：
- Host (OOAPI) 接受与呈现端
- Sandbox (OOAPI) 代码沙箱与BiliScript运行时

两个部分可以独立运行，也可以和体合作。 **对于仅需要普通的弹幕实现支持（包括高级定位弹幕），使用 
CommentCore 主体即可。** CommentCore主体可以进行：弹幕呈现和空间规划（滚动、逆向、顶部、底部、
高级定位、高级移动），弹幕过滤和实时弹幕支持。

对于仅需要对代码沙箱支持的，可以直接使用  KagerouEngine。它对 CommentCore没有依赖。

对于希望进行完整还原的，可以参考合体配置方法。

### 架设 CommentCore 主体
CommentCore主体分为两个重要部分：CSS和JS。在编译后，分别位于`build/style.css` 和 
`build/CommentCoreLibrary.js`。使用时必须保证引用了两个文件（或者在项目中已经合并入两个文件的
代码），尤其要注意CSS不能没有。

### 架设 KagerouEngine 引擎
KagerouEngine分为两个部分：JS Host和Worker Client。在编译后，分别位于 
`build/scripting/Host.js` 和 `build/scripting/Worker.js`。架设时，只需在外部引入 
`Host.js` 然后把 `Worker.js` 的位置，在初始化 `Host` 时传递进入即可。`scripting/` 目录的
结构关系需要保护，以免Worker无法载入相应的需要的运行时库。

### 合体配置方法
目前的合体方法是把 `CommentManager.scripting` 赋值成 Scripting Host生成的 Sandbox实例
即可。未来会有专门的方法和事件供挂载。

## 发送弹幕（Sending Comments）
发送弹幕需要后端服务器的支持，格式（传输格式）、模式（支持什么种类的弹幕）、弹幕参数（字体字号颜色等）
等也根据不同的系统而需求不同。

在未来会有一个 Provider 类来用于规范化如何定义弹幕发送的方法，但是目前只要自己实现这些功能即可～
往往是绑定一个发送按钮，根据一些GUI参数确定弹幕参数跟格式，最后用Ajax派发一个POST，在收到POST结果
后如果成功则显示弹幕到现在的屏幕上，这样的流程。

