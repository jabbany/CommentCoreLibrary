# Documentation 文档

CCL包括一套尽可能完备的文档来帮助二次开发。文档主要针对两个部分：各种东西都是什么，各种东西都应该
怎么用。如果想看看现实里使用了 CCL 的项目，可以参考 [Powered By CCL](PoweredByCCL.md) 里面
的不完全收录。

## 入门文档 Tutorial
想开始对 CCL 的开发却还不太了解 CommentCoreLibrary？希望在自己的项目里使用 CCL 却不熟悉接口？
赶紧来看:
- [入门文档](Tutorial.zh_CN.md)
- [チュートリアル](Tutorial.ja_JP.md)
- [Quick Tutorial](Tutorial.md)

## 常见问题 FAQ
理论上CCL兼容的功能非常之多，但是并不是所有的功能都在库中有实现，有关实现一些效果的较好的做法，请参考
[DoingItRight 推荐使用方法](DoingItRight.md)。里面介绍了如何优雅的实现大部分现有弹幕站点的一些
附加功能，包括实时弹幕，弹幕显示格式切换，调整运动速度，全屏同步大小等等。

### 发送弹幕 Sending Comments
发送弹幕需要后端服务器的支持，格式（传输格式）、模式（支持什么种类的弹幕）、弹幕参数
（字体字号颜色等）等也根据不同的系统而需求不同。

### 配置直播
CommentCoreLibrary 支持应用于直播环境。如果打算用于直播，请参靠
[推荐使用方法](DoingItRight.md) 内相关章节。

## 组件文档 References
以下章节包含有关 CommentCoreLibrary 的各个组件的文档，包括 API 接口信息、各种格式定义等等。

### 部件参考 Components
- [CommentManager 弹幕管理器](CommentManager.md)
- [CommentObject 弹幕对象](CommentObject.md)
- [CommentProvider 弹幕通讯管理器](CommentProvider.md)
- [KagerouEngine 代码弹幕文档](scripting/Readme.md)

### 格式参考 Formats
- [Comment Properties 抽象弹幕对象属性](CommentProperties.md)
- [Comment Types 弹幕类型与参数参考](CommentTypes.md)
- [Comment Sizes 弹幕字体大小参考](CommentSizes.md)
- [Data formats 文件格式](data-formats/)

## 部署文档 Deployment
CommentCoreLibrary 主要包括两个部分，CommentCore 主体和 KagerouEngine 代码弹幕支持引擎。
两个部分可以独立运行，也可以和体合作。 **对于仅需要普通的弹幕实现支持（包括高级定位弹幕），使用
CommentCore 主体即可。**

有关部署的具体信息，请参考 [Deployment 部署方法](Deployment.md)
