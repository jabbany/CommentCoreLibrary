# CCL API (程序接口)

Note, the API spec is not completely and correctly implemented yet. 注意，目前尚未
完全实现这些接口。

CommentManager (弹幕管理器)
----
The `CommentManager` is initalized by passing in a single parameter that assigns
the HTML DOM object to write comments on. This object should have a class type
of `container` and be a descendant of another wrapper under the class `abp`.
This DOM object is internally referenced as the comment's "stage".

If you have not initialized this object and wish to do so, you should use the
`CommentCore` object to initialize the entire set.

弹幕管理器通过提供一个用于渲染的HTML元件来初始化。这个HTML元件应该属于"container"这个css 类
并是 'abp' 类的一个包裹元素的子元素

	var cm = new CommentManager ( HtmlDomElement stage )

Example of the DOM substructure （HTML结构体的示例）

	<div class = "abp">
		<div class = "container">
			<!--
				This div will become the comment stage
				You should pass a DOM reference to this element NOT its parent
			-->
		</div>
	</div>

The `CommentManager` expose a simple API for manipulating comments. The
functions along with their usage will be defined below. `CommentManager` 会暴露出
一套简单的API来供开发者控制弹幕。

* `load ( CommentData[] timeline )`
	This method loads in an array of unsorted comment data. Comment data is
	directly obtained by parsing the input file. The method will re-sort this
	data by timeline-time then by id then by send-time. It will overwrite the
	current timeline instantly. 这个方法会载入一个新的弹幕列表到弹幕管理器中弹幕列表将会被
	排序后存储。调用后方法会覆盖任何可能已经存在的时间轴（弹幕信息列表）。

* `start ()`
	This method starts the internal clock that scrolls comments. Comments will
	not move if the comment manager has not been started. 这个方法会启动弹幕管理器的
	内部计时器。弹幕在未启动计时器的状态下是不会移动的。

* `stop ()`
	This method does the opposite of start and pauses the internal clock.
	Comments currently scrolling and effects in progress will be stopped
	immediately. 这个方法于 start 方法作用相反，正在进行的效果和正在滚动的弹幕会被强制停止。

* `insert ( CommentData comment )`
	This method allows for insertion of new comment data into the timeline. It
	keeps the timeline sorted even after insertion. 这个方法会往弹幕管理器中插入一条
	弹幕，并保持时间轴顺序。注意：当插入弹幕的时间小于已经播放的时间，有可能看不到的。

* `send ( CommentData comment )`
	This method **sends a comment to display on the stage**. It does not add the
	comment into the timeline. The effects are instant, and the comment will
	start if the CommentManager's internal timer is running (see `start`, `stop`
	methods). Please note: This does NOT send the comment data to the remote
	server, for that you will need to send to the provider instead.这个方法会把一条
	弹幕显示到屏幕上。它不会把弹幕发送到服务器，也不会把弹幕插入时间轴。只要弹幕管理器处于运行状态
	弹幕就会立刻显示（参考`start`，`stop`控制弹幕管理器状态）。

* `clear ()`
	This method clears the stage. It removes all running comments, but keeps the
	timeline intact. 这个方法会强制清空显示界面，但是会保留时间轴。

* `time ( integer time )`
	This method sets the playhead time of the comment manager. Time is provided
	in miliseconds. All the comments from the last time() to the current time()
	will be output if the difference in time is positive and falls below a
	threshold. 这个方法设置了CommentManager的播放时间，单位是毫秒(0.001s)，所有在上一个
	time 调用到现在的弹幕都会被输出，前提是两次时间差是正数且低于一个限度。

CommentFilter （弹幕过滤器）
----
The comment filter is an object that determines if a comment should be displayed
or not depending on its initializing data. It can also control how running
comments are displayed. 弹幕过滤器会根据弹幕信息判对一个弹幕是否显示，当然也可以控制弹幕运行的
方式。

* `doValidate ( CommentData comment )`
	This method validates the comment data against a list of filters. It returns
	true if the comment is displayed, false if it should be hidden.

* `addRule ( Rule filterRule )`
	This method adds a rule into the filter engine.

	Rule Definitions:

	Rule {
		"mode": int/string comment_mode,
		"operator": string <comment_filter_operator>,
		"subject": string <comment_property>,
		"value": primitive <value>
	}

	For modes, it can be any of [these modes](CommentTypes.md) or 'all'.
	Operators can be any of:
	* Equality operators : = , ==, eq, equals
	* Comparison operators : < , >
	* Inequality operators : !=, ineq
	* Regular expression match : matches, regex, ~ (or inversly) notmatch, iregex, !~
	* Range operators : range

* `addModifier ( function modifier ( CommentData cd ) )`
	This method adds a modifier that given comment data returns a modified version
	of the comment data.

* `setRuntimeFilter ( function filter ( Comment c ) )`
	This method is run every time any element is moved animated. It has access
	to the comment's state. You can only set ONE runtime filter for the comments
	as setting this greatly influences speed.
