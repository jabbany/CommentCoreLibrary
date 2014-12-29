# Introduction 入门文档
入门文档设计为面向有较少 Web 或者 JS 开发经验的开发者们。如果你比较熟悉 Web 开发可以直接阅读 CCL
的设计文档。

# 怎么架设 （Deployment）
架设并开发 CCL 其实不难，首先你要确保你有一个服务器开发环境，比如在本机上安装的 Apache 或者你能访
问到的在云端安装的 nginx 等等。请先通过浏览器测试你能正确访问该服务器。如果你在本地开发，请尝试访问

    http://localhost/
    
来测试连同性。

**注意：** 请注意确保你在服务器环境下开发 CCL ，在开发时如果遇到各种资源无法载入，请确保您的地址栏
是以 `http:` 或者 `https:` 开头的而不是 `file:` 等等。

**附加：** 如果你在linux下开发，任何一个静态Web服务器软件都可。Windows下开发的话，仅作为推荐参考
可以试试 XAMPP。

### 正确的下载类库 （Getting CCL）
Github 有提供以 Zip 方式下载CCL的选项，但是我们不推荐你这样做。正确使用 CCL 二次开发有两种推荐
的方法：

- 作为外部库通过 npm 或者 bower 引入： 只需运行 `npm install comment-core-library --save`
    即可获取最新版的稳定CCL库。通过 `node_modules/comment-core-library/build/`
    可以引用需要的文件。
- 直接 Clone 下 Git 代码仓库： 通过 `git clone https://github.com/jabbany/CommentCoreLibrary.git`
    即可 Clone下 CCL 的全代码库。建议把工作目录放到 Web 开发服务器下的子文件夹内，如 `/var/www/`
    或者 `D:\webroot\htdocs`下之类的。之后进入 CommentCoreLibrary 文件夹，
    运行 `npm install grunt-cli -g` 和 `npm install` 
    （注意：可能需要管理员权限） 即可开始开发
    
第一个方式主要用于希望直接挂载 CCL 功能的二次开发，而第二种方式则面向对 CCL 本生的开发有兴趣的人。

### 正确的引用库 （Embedding CCL）
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

### 调用API函数 （API Calls）
调用API目前来说比较容易，在建立好页面dom之后，只要绑定 CommentManager 即可。

    var CM = new CommentManager(document.getElementById('my-comment-stage'));
    CM.init(); // 初始化
    
之后 `CM` 实例会提供如下功能：

    // 载入弹幕列表
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
    
    // 插入弹幕
    var someDanmakuAObj = {
        "mode":1,
        "text":"Hello CommentCoreLibrary",
        "stime":1000,
        "size":30,
        "color":0xff0000
    };
    CM.insert(someDanmakuAObj);
    
    // 启动播放弹幕（在未启动状态下弹幕不会移动）
    CM.start();
    
    // 停止播放（停止弹幕移动）
    CM.stop();
    
    // 更新时间轴时间
    CM.time(500);
    CM.time(1000);
    
具体使用的参考可以参考 `demo/intro`。内有大部分此示例的代码。

### 发送弹幕 （Sending Comments）
CCL自己没有发送弹幕的内建支持，不过实现起来非常轻松。具体实现需要根据自己服务器的需求决定。

### 实时弹幕 （Realtime Comments）
参考[推荐的实现方法](DoingItRight.md)
