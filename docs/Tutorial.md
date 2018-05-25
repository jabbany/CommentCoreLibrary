# Introduction
[简体中文](Tutorial.zh_CN.md) | [日本語](Tutorial.ja_JP.md)

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
The compiled output of CCL is located in the `dist/` directory. The two most
important files are`CommentCoreLibrary.js` and `style.css`. They are required
for both running the library and presenting an absolute CSS base. You may also
find corresponding minified targets `.min.js` and `.min.css`. These are useful
for deployment whileyou should be using the non-minified versions in testing
and development as they will allow for better debugging.

To include CCL, you can use:

````HTML
<head>
    ... other header records ...
    <link rel="stylesheet" href="dist/style.css" />
    <script src="dist/CommentCoreLibrary.js"></script>
    ... other header records ...
</head>
````

Please take note of the directory structure and make sure you're referencing
the correct path (these may be different on your server).

Next, before binding the CCL, make sure that you have the following structure
in your DOM:

````HTML
<div id='my-player' class='abp'>
    <div id='my-comment-stage' class='container'></div>
</div>
````

The danmaku comments will be inserted into `container`. This kind of nested
architecture allows you to present arbitrary elements that can be covered by
the danmaku container. Please do note that if you plan to use a floating
container, make sure it is a child-element of the `abp` class (or adjust the
CSS according to your needs).

### API Calls
Here are just a few examples to get you started with using CCL's APIs. A more
detailed version is documented for each specific component.

````JavaScript
    var CM = new CommentManager(document.getElementById('my-comment-stage'));
    CM.init(); // Initialize the CCL
````

This enables the `CommentManager`, which you can then manipulate as follows:

````JavaScript
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

// Updates the current playhead time
CM.time(500);
CM.time(1000);
````

For more detailed use and examples, please view `demo/intro`.

### Sending Comments
CCL does not include any inherent comment sending capabilities and it is up to
you to implement an adequate backend and the necessary data formats and
communication protocols.

This should be fairly easy and something akin to a simple AJAX POST call would
be sufficient. You should also implement your own UI elements to facilitate
selecting properties (text size, color etc).

### Realtime Comments
Please read [Recommended Implementations](DoingItRight.md) for some details on
how to implement realtime comments.
