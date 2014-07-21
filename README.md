# CommentCoreLibrary 弹幕核心通用构件
The CommentCoreLibrary is a set of Javascript modules that make up the
core controller for comments streaming on top of timed media (video or audio). 
It is intended as a catalyst for the development of timed "danmaku" comments 
in HTML5.

Developers willing to incorporate similar comment streaming functionalities 
inside their own projects (whether web based or not) are encouraged to learn 
from and extend from the CommentCoreLibrary.

## Testing
We have a live demo [here](http://jabbany.github.com/CommentCoreLibrary/demo). 
Feel free to [open tickets](CONTRIBUTING.md) if this demo test has bugs. 

## License
The CommentCoreLibrary is licensed under the permissive MIT License. If you wish
to use this in any project, you can simply include the following line:

    CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT license

## Examples and Documentation
- Documentation can be found inside the `docs/` folder. 
- Some sample extension modules may be found in `extend/`.
- Experimental modules are in `experimental/`.
- You may test using test data found in `tests/`.

## Contributing
We encourage any contributions to this project, please read 
[CONTRIBUTING](CONTRIBUTING.md) for details on how to contribute to the project.

Also, feel free to have a look at our sister project 
[ABPlayerHTML5](https://github.com/jabbany/ABPlayerHTML5) for a reference 
implementation of a video player with CommentCoreLibrary.

# 弹幕核心通用构件
弹幕核心通用构件是一套基于JavaScript构建的弹幕控制器，意在催化HTML5下弹幕播放器的发展。同时方便
希望了解弹幕播放器运作原理的开发者，提供简单但是深入的入门。开发者们可以根据弹幕核心通用构件来自定义
自己的流媒体注释播放模式。

不管你在开发基于Javascript的Web服务，还是其他的需要弹幕播放功能服务，都可以参考弹幕核心
的实现代码。我们以简单的方法构建了 (1) 时间轴管理 (2) 基础空间规划 (3) 弹幕过滤 (4) 
高级弹幕效果 (5) 基础格式解析 (6) 代码弹幕支持

## 测试
你可以在[这里](http://jabbany.github.com/CommentCoreLibrary/demo) 访问到测试页面。
我们欢迎各种[BUG报告](CONTRIBUTING.md)。

## 许可
本项目采取非常宽松的MIT许可。该许可允许你把本项目运用在任何开源或是闭源的，非营利或商业性的项目中。
您只需在使用到的地方添加下面一行注释：

    CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT license

## 使用
- 有关本项目的文档可以在 `docs/` 文件夹里面找到。
- 一些功能性扩展模块会出现在 `extend/` 中。
- 一些实验性模块在 `experimental/` 里。
- 测试数据在 `tests/` 里。

## 做出贡献
非常欢迎提交问题报告和意见建议，同时你也可以在GitHub上Fork本工程，并发送Pull请求来提交
你对项目的贡献。我们非常欢迎二次开发哟！有关具体介绍请参考 [CONTRIBUTING](CONTRIBUTING.md)。

我们欢迎对项目任何细节处的针对性研发，尤其比如：解析功能、高级弹幕/代码弹幕和CSS优化等。
如果希望研发播放器的构造和功能，请参考姊妹项目 ABPlayerHTML5。
