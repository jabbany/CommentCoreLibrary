# 弹幕源管理器 CommentProvider
弹幕源管理器提供了一套简单的绑定静态或者动态弹幕的系统。使用CommentCoreLibrary并不需要使用
CommentProvider不过CommentProvider提供了一套更好的载入弹幕的方法。

## Properties 属性

### SOURCE_JSON &lt;String&gt; = "JSON" [静态]
Static value for JSON data format. 静态的表示 JSON 数据格式的标签

### SOURCE_XML &lt;String&gt; = "XML" [静态]
Static value for XML data format.　静态的表示 XML 数据格式的标签

### SOURCE_TEXT &lt;String&gt; = "TEXT" [静态]
Static value for TEXT data format. 静态的表示纯文本数据格式的标签

## Static Methods 静态方法

### BaseHttpProvider(method:String, url:String, responseType:String, args:Object, body:*):Promise
BaseHttpProvider is a built-in static provider that resolves by perfoming an XHR
基础HTTP Provider，内建的静态Provider

### JSONProvider(method:String, url:String, args:String, body:*):Promise
JSONProvider is a built-in static provider that resolves to a JSON result
基础的JSON Provider，内建的静态Provider提供JSON格式

### XMLProvider(method:String, url:String, args:String, body:*):Promise
XMLProvider is a built-in static provider that resolves to a document object
基础的XML Provider，内建的静态Provider提供document(DOM/XML)格式

### TextProvider(method:String, url:String, args:String, body:*):Promise
TextProvider is a built-in static provider that resolves to a string
基础的Text Provider，内建的静态Provider提供字符串格式

## Methods 方法
Terminology:
- Static Source 静态源

    A static source is a source that is loaded once and not continuously 
    refreshed during playback. 静态源是一个只会被载入一次的源，播放时不会持续刷新这种源。

- Dynamic Source 动态源

    A dynamic source is a source that provides events when new comments arrive.
    动态源是一个可以绑定监听器的源。它会在弹幕到来时触发一些 Event 来提醒弹幕播放器。

### addStaticSource(provider:Promise, type:String):this
Adds a static provider (see above for examples) and bind it to provide the 
specified type. 添加一个静态弹幕源。

### addDynamicSource(source:DynamicSource, type:String):this
Adds a dynamic provider and bind it. 添加并绑定一个动太源。

### addTarget(commentManager:CommentManager):this
Adds a target to broadcast comment load data to. This allows hooking multiple 
comment managers to the same source. 绑定一个目标弹幕管理器。可以绑定多个弹幕管理器到同一个
弹幕源系列

### addParser(parser:IParser, type:String):this
Adds a parser that parses data format specified by type. 添加一个解析器并绑定到一个
格式下

### load():Promise
(Re)loads the static sources. 载入或重新载入静态弹幕源

### start():Promise
Loads and binds all sources, parsers and targets. 绑定并载入所有的源，解析器和目标。

### destroy():Promise
Unbind all dynamic sources and destroys the current provider. The provider 
cannot be used after calling this method. 解除所有动态源的绑定并关闭目前的Provider
