Contributing 做出贡献
==================================
CommentCoreLibrary欢迎广大开发者积极做出贡献，提交补丁和Bug信息。以下將介绍如何有效的提交贡献到
CommentCoreLibrary上。

CommentCoreLibrary welcomes all developers to contribute to the project in any 
way, such as code, documentation or issue reports. This document describes how 
you can effectively contribute to make our work easier.

### 不具合报告（Bug Reports）
CCL欢迎一切相关的缺陷报告，包括浏览器兼容性问题，代码报错，和显示偏差等等。请善用 Github 自建的
[Issue Tracker](https://github.com/jabbany/CommentCoreLibrary/issues)。中文英文
都可以。请在标题上尽可能清楚直观地描述问题，如：“弹幕3D效果投影距离与期待情况有偏差” 这样的标题。

有关显示相关的问题，请最好附带上你的浏览器版本，操作系统/平台版本。欢迎截图，欢迎 console 
错误信息复制粘贴。请确保你有标准中文字体（宋体 Simsun【必需】，黑体 Simhei【必需】，
雅黑 Microsoft YaHei，幼圆 YouYuan，隶书），和日文字体（Mincho， Gothic）来达到最佳显示
效果。

Please use the issue tracker provided by Github to submit bug reports. These 
include any compatibility problems, script generated errors, display problems
etc. English or Chinese issue reports are both welcome and accepted. Descibe the 
problem as clearly as possible in the title too. Also, for display and 
compatibility problems please also include your browser vendor and OS info.

PS: Just as heads up, check your font support first. Unix based systems often 
choke on Chinese font names and render some fixed point animations wrong, this 
may happen if you don't have fonts configured correctly. You should install the 
basic Chinese font SimHei for accurate positioning of comments. 

### 新功能讨论（Feature Request）
新功能讨论，接口讨论，实验性分支（`dev-*`，`beta-*`分支树）的问题，也欢迎使用 Issue 报告。CCL
是弹幕渲染层，有关视频格式，旧浏览器的向下兼容问题和各种平台上的挂载问题，可以在相应的
ABPlayerHTML5 项目上报告

You can also use the issue tracker to submit feature requests, implementation 
discussions and development questions. Remember that CCL is just a comment 
overlay, for problems concerning video, backwards compatability with pre-HTML5 
and flash fallback, please report to ABPlayerHTML5 or other corresponding 
projects.

### 提交代码（Contributing Code）
提交代码请使用 Github 自带的 Pull Request 功能。先把这个库 Fork 到你的账户，进行更改，之后
选择好节点发送 Pull Request。注意：如果你的更改是对别的分支的更新，比如代码分支或者CSS动画分支，
请提交到相应的分支下，而不是 `master`。

Contributions of code or documentation are very welcome! You can use Github's 
in-built Pull Request feature to submit a patch. Make sure the patch applies to
the correct branch if you're not working on `master`. 
