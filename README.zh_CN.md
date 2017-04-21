# 弹幕核心通用构件 CommentCoreLibrary
[![NPM version](https://badge.fury.io/js/comment-core-library.svg)](http://badge.fury.io/js/comment-core-library)
[![Bower version](https://badge.fury.io/bo/comment-core-library.svg)](http://badge.fury.io/bo/comment-core-library)
[![Built with Grunt](https://cdn.gruntjs.com/builtwith.png)](http://gruntjs.com/)
[![License](http://img.shields.io/badge/license-MIT-brightgreen.svg)](http://opensource.org/licenses/MIT)
[![Build Status: Linux](https://travis-ci.org/jabbany/CommentCoreLibrary.svg?branch=master)](https://travis-ci.org/jabbany/CommentCoreLibrary)
[![Coverage Status](https://img.shields.io/coveralls/jabbany/CommentCoreLibrary.svg)](https://coveralls.io/r/jabbany/CommentCoreLibrary?branch=master)

其它语言: [English](README.md)

弹幕核心通用构件是一套基于JavaScript构建的弹幕控制器，意在催化HTML5下弹幕播放器的发展。同时方便
希望了解弹幕播放器运作原理的开发者，提供简单但是深入的入门。开发者们可以根据弹幕核心通用构件来自定义
自己的流媒体注释播放模式。

不管你在开发基于Javascript的Web服务，还是其他的需要弹幕播放功能服务，都可以参考弹幕核心
的实现代码。我们以简单的方法构建了 (1) 时间轴管理 (2) 基础空间规划 (3) 弹幕过滤 (4)
高级弹幕效果 (5) 基础格式解析 (6) 代码弹幕支持。

## 测试
你可以在[这里](http://jabbany.github.io/CommentCoreLibrary/demo) 访问到测试页面。
我们欢迎各种[BUG报告](CONTRIBUTING.md)。

## 许可
本项目采取非常宽松的MIT许可。该许可允许你把本项目运用在任何开源或是闭源的，非营利或商业性的项目中。
您只需在使用到的地方添加下面一行注释：

    CommentCoreLibrary (//github.com/jabbany/CommentCoreLibrary) - Licensed under the MIT license

## 使用
- 有关本项目的[文档](docs/) 可以在 `docs/` 文件夹里面找到。
- 一些实验性模块在 `experimental/` 里。
- 测试数据在 `test/` 里。

## 做出贡献
非常欢迎提交问题报告和意见建议，同时你也可以在GitHub上Fork本工程，并发送Pull请求来提交
你对项目的贡献。我们非常欢迎二次开发哟！有关具体介绍请参考 [CONTRIBUTING](CONTRIBUTING.md)。

我们欢迎对项目任何细节处的针对性研发，尤其比如：解析功能、高级弹幕/代码弹幕和CSS优化等。
如果希望研发播放器的构造和功能，请参考姊妹项目 ABPlayerHTML5。
