CCLNative CCL原生弹幕格式 JSON
===================
CCLNative 是一套原生于 CCL的弹幕格式，用于配合 WordPress插件等现代化的HTML5弹幕插件。设计的
主要思想是方便 JS 读取和未来的可扩展性。

根结构
-------------------
标注 [OPT] 的字段为可选字段

    {
        "v":1,
        [OPT] "len": 10,
        [OPT] "offset": 0,
        [OPT] "socket": "",
        [OPT] "alias":{...},
        "timeline":[
            ...
        ]
    }
    
1. `v` - Version Number
    版本字段是负责告知解析器目前的版本号码的。所有的CCLNative实现需要遵循如下原则：对于版本1必须
    提供完全的支持，对于更高级的版本，应该尽可能提供支持。同时版本之间必须保证字段互通性，即，如果
    有字段 A 出现在版本 V 下，则任何大于版本 V 的版本，都应该无歧义的依然同样的解析 A 。
    
2. `len` - Length
    弹幕总数。如果 len 与 timeline 等长，则说明本文件包括所有弹幕，否则如果 len 大于 
    timeline长度说明本文件只包含弹幕库的部分弹幕。这种场合下远程服务有可能提供方法获取所有弹幕，
    剩余弹幕，也有可能不提供此方法（用 len 表示历史弹幕总数）。len不得小于 timeline 长度。
    
3. `socket` - Socket id
    socket接口初始化配置字段，用于建立与聊天服务器的链接。
    
4. `alias` - Danmaku object property field alias
    这个字段是一个一层对应表，表示了弹幕文件的属性字段和标准字段的定义。比如如果定义为 "m":"mode"
    则在解析时 timeline 中的所有弹幕对象的 "m" 属性会被理解为 "mode"。当然，如果原来存在 
    "mode" 则 "mode"属性还是会被理解为 "mode"，在二者不同的情况下，哪个属性覆盖哪个是不确定的。

5. `timeline` - Danmaku Object timeline	
    时间轴。包含精华。
   
timeline结构
----------------
timeline里的弹幕对象没有时序保证，一些实现可能会把最大的弹幕放在前面来保证加载，也有实现可能会把
大的弹幕放在后方，而先行加载大量小型弹幕。
