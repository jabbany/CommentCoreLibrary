# 弹幕源管理器 CommentProvider
弹幕源管理器提供了一套简单的绑定静态或者动态弹幕的系统。使用CommentCoreLibrary并不需要使用
CommentProvider不过CommentProvider提供了一套更好的载入弹幕的方法。

CommentProvider提供了一个方便控制解析器的组件，本身并不解析弹幕格式。具体的格式解析接口和
实现请参考 [data-formats 章节](data-formats/Readme.md)

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

## Dynamic Sources 动态源
动态源可以是两种: LongPoll 或者 EventDispatcher. 目前 EventDispatcher 模式已经实现。

LongPoll:

    var source = new LongPollDynamicSource();
    var poller = source.get();
    
    while(true) {
        poller = poller.then(obj => {
            cm.send(Parser.parseOne(obj));
            return source.get();
        })
    }

EventDispatcher:

    var source = new EventDispatcher();
    source.addEventListener('receive', e => {
        cm.send(Parser.parseOne(e));
    });

## Example 使用例 

### 设定静态XML文件解析器

    // 制作弹幕供应器
    var provider = new CommentProvider();

    // 添加一个静态弹幕源（只加载一次）
    provider.addStaticSource(CommentProvider.XMLProvider('GET', 'http://localhost/danmaku.xml'), CommentProvider.SOURCE_XML)

    // 添加一个解析器
    provider.addParser(BilibiliFormat.XML_PARSER(), CommentProvider.SOURCE_XML);
    
    // 添加一个目标 (CommentManager)
    var cm = new CommentManager($('my-comment-container'));
    provider.addTarget(cm);
    
    // 加载弹幕并启动 cm
    cm.init();
    provider.load.then(function () {
        cm.start();
    }).catch(function (e) {
        alert('载入弹幕出错了！' + e);
    });
    
### 设定多个冗余解析器

    var provider = new CommentProvider();
    
    provider.addStaticSource(CommentProvider.XMLProvider('GET', 'http://localhost/danmaku.xml'), CommentProvider.SOURCE_XML);
    provider.addStaticSource(CommentProvider.TextProvider('GET', 'http://localhost/backup-danmaku.txt'), CommentProvider.SOURCE_TEXT);
    
    provider.addParser(BilibiliFormat.XML_PARSER(), CommentProvider.SOURCE_XML);
    provider.addParser(BilibiliFormat.TEXT_PARSER(), CommentProvider.SOURCE_TEXT);
    
### 多格式自动回退解析

    var provider = new CommentProvider();
    
    provider.addStaticSource(CommentProvider.XMLProvider('GET', 'http://localhost/danmaku.xml'), CommentProvider.SOURCE_XML);
    
    provider.addParser(SomeFormat.XML_PARSER(), CommentProvider.SOURCE_XML);
    provider.addParser(SomeOtherFormat.XML_PARSER(), CommentProvider.SOURCE_XML);
    
### 实时弹幕

    var provider = new CommentProvider();
    
    // 绑定动态源，动态源可以是两种：LongPoll 或者 EventDispatcher
    provider.addDynamicSource(source, CommentProvider.SOURCE_JSON);
    // 会使用 parseOne 来逐个解析动态弹幕
    provider.addParser(SomeFormat.JSON_PARSER(), CommentProvider.SOURCE_JSON);

    provider.addTarget(cm);
