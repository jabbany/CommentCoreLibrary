# Introduction
The introduction document is geared towards developers that have some experience
in web development but have not used CommentCoreLibrary before. Advanced users
should dive directly into the relevant interfaces documentation

## Deployment
Deploying CommentCoreLibrary (CCL) is simple. On a local server, you should make 
the files contained in the repository accessible on a local server. Then you can 
access:

    http://localhost/
    
to make sure the server is up and running.

**Note:** Please make sure that you are working with an HTTP protocol (HTTP, HTTPS)
when developing CCL. Many parts of CCL may not work if you are accessing it 
through the `file:` protocol.

### Obtaining CCL
While you can download a packaged version of this repo through GitHub, it's not
recommended that you do this since it makes development and updating difficult.
Instead, you should obtain CCL using one of the following ways:

- Using CCL as a library:

    CCL is indexed on both `npm` and `bower`. To incorporate CCL into a node 
    priject, one can simply `npm install comment-core-library --save` to acquire
    the latest STABLE release of CCL. Distributable files (compiled versions)
    will be accessible here: `node_modules/comment-core-library/dist/`

- Cloning CCL to work on it：

    If you want to develop and extend CCL, you are advised to clone the 
    repository `git clone https://github.com/jabbany/CommentCoreLibrary.git`. 
    You should also have `grunt` installed to enable compiling the project. 
    Make sure to update the node modules when you first clone the repository.

### Embedding CCL
CCL编译好的代码在 `build/` 目录下。有两个文件非常重要： `CommentCoreLibrary.js` 和 `style.css`。
这两个分别负责CCL的JS引擎部分和CSS呈现部分，不能省略。相对的还有俩 `.min.js`和 `.min.css` 文件
是上述文件的压缩版。压缩版代码都在一行，较不方便对行号调试，建议开发时采用未压缩版，架设时则可以采取
压缩版。

引用方法为，在对应的HTML文件头部添加

    <head>
        ... 其他头部信息 ...
        <link rel="stylesheet" href="build/style.css" />
        <script src="build/CommentCoreLibrary.js"></script>
        ... 其他头部信息 ...
    </head>
    
注意文件路径调整合理。

之后在相应需要弹幕的位置，放置如下 HTML DOM结构：

    <div id='my-player' class='abp'>
        <div id='my-comment-stage' class='container'></div>
    </div>
    
其中弹幕结构会在 `container` 这个 div 里插入。采用双层嵌套可以允许你的弹幕 container 于实际容器
的大小不同，用于实现避开字幕等等功能。

### API Calls
Here are just a few examples to get you started with using CCL's APIs. A more 
detailed version is documented for each specific component. 

    var CM = new CommentManager(document.getElementById('my-comment-stage'));
    CM.init(); // Initialize the CCL

This enables the `CommentManager`, which you can then manipulate as follows:

    // Load a list of comments
    var danmakuList = [
        {
            "mode":1,
            "text":"Hello World",
            "stime":0,
            "size":25,
            "color":0xffffff
        }
    ];
    CM.load(danmakuList);
    
    // Insert a comment into the playlist
    var someDanmakuAObj = {
        "mode":1,
        "text":"Hello CommentCoreLibrary",
        "stime":1000,
        "size":30,
        "color":0xff0000
    };
    CM.insert(someDanmakuAObj);
    
    // Show a comment immediately
    // This ignores stime
    CM.send(someDanmakuAObj);
    
    // Start the player (comments will not move unless this is called at least once
    CM.start();
    
    // Stop the player (moving comments will be paius
    CM.stop();
    
    // 更新时间轴时间
    CM.time(500);
    CM.time(1000);
    
具体使用的参考可以参考 `demo/intro`。内有大部分此示例的代码。

### 发送弹幕 （Sending Comments）
CCL自己没有发送弹幕的内建支持，不过实现起来非常轻松。具体实现需要根据自己服务器的需求决定。

### 实时弹幕 （Realtime Comments）
参考[推荐的实现方法](DoingItRight.md)
