# Parsers 解析器
Parsers是期间过渡的支持库，用于解析弹幕文件，产生符合格式的弹幕抽象对象传送给 CommentManager。
现在 Parsers 已经被合并到 Providers（供应源）里面，具体使用请参考 [CommentProvider](../CommentProvider.md) 使用例。

目前CCL默认的编译自带支持如下格式：
- [Bilibili Format](bilibili-xml.md)
- [Acfun Format](acfun-json.md)

## 兼容性 Compatibility

解析器是通过各种零散的网络资源和一定的反向工程完成的，我们并不能保证解析器的还原度有多高或者兼容性
有多好。另外，有时弹幕文件本身会有语法错误等问题，而浏览器一向对格式要求的严谨，所以一些地方难免出
现解析失败的情况。

使用者可以参考解析器，也欢迎提供新的改进。
