# Readme
The CommentCoreLibrary is a set of Javascript 'classes' that make up the
core controller for comments streaming on top of a video. It is intended
as a catalyst for the future development of timed comments streaming 
alongside videos. 

The CCL is intended for education purposes (in contrast to 
[ABPlayerHTML5](https://github.com/jabbany/ABPlayerHTML5)
which focuses on real world use) and is separated into sections that 
help developers understand how the library and how danmaku comments 
work.

Developers willing to incorporate similar comment streaming 
functionalities inside their own projects (whether web based or not) are
free to learn from and extend from the CommentCoreLibrary.

## Testing on your browser
You can see a live demo (most current source) 
[here](http://jabbany.github.com/CommentCoreLibrary/demo). Feel free to open 
tickets if this demo test has bugs. Remember to tell me your browser 
vendor/version info though. PS, just a heads up, due to lack of
fonts, Linux systems may render some fixed point animations wrong, this 
is normal. You should install the basic chinese font SimHei for accurate
positioning. 

## License
The CommentCoreLibrary is licensed under the permissive MIT License. If 
you wish to use this in any project, you can simply include the 
following line:

    CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - 
    Licensed under the MIT license
 
## Examples and Documentation
- Documentation can be found inside the /docs/ folder. 
- Some sample extension modules may be found in /extend/.
- Experimental modules are in /experimental/.
- You may test using test data found in /tests/.

## Contributing
Please feel free to fork the project on GitHub. Also, bug reports and 
feature requests are welcome!

# 弹幕核心通用构件
弹幕播放核心是一套原始的基于JavaScript构建的弹幕控制器，意在催化HTML5下弹幕播放器的
发展，和为希望了解弹幕播放器弹幕组件运作原理的开发者提供简单但是深入的入门。该播放器核心
由ABPlayerHTML5衍生，并现在被其使用。开发者们可以根据弹幕播放核心来自定义自己的流媒体
注视播放模式。

不管你在开发基于Javascript的Web服务，还是其他的需要弹幕播放功能服务，都可以参考弹幕核心
的实现代码。我们以简单的方法构建了 (1) 时间轴管理 (2) 基础空间规划 (3) 弹幕过滤 (4) 
高级弹幕效果 (5) 基础格式解析

## 测试
你可以在[这里](http://jabbany.github.com/CommentCoreLibrary/demo) 访问到测试页面。
我们欢迎各种BUG提交。如果你在用Linux，请确保你有标准中文字体（宋体 Simsun【必需】
，黑体 Simhei【必需】，雅黑 Microsoft YaHei，幼圆 YouYuan，隶书），和日文字体
（Mincho， Gothic）。

## 许可
本程序为教学用意，采取非常宽松的MIT许可。该许可允许你把本项目运用在任何开源或是闭源的，
非营利或商业性的项目中。
您只需在使用到的地方添加下面一行注释：

    CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - 
    Licensed under the MIT license 

## 使用
有关本项目的文档可以在 /docs/ 文件夹里面找到。一些功能性扩展模块会出现在 /extend/ 中。
一些实验性模块在 /experimental/ 里面。

## 做出贡献
非常欢迎提交问题报告和意见建议，同时你也可以在GitHub上Fork本工程，并发送Pull请求来提交
你对项目的贡献。我们非常欢迎二次开发哟！

同时我们也欢迎对项目任何细节处的针对性研发，如解析功能，高级弹幕和CSS优化等。如果希望研发
播放器的构造和功能，请参考 ABPlayerHTML5 项目～
