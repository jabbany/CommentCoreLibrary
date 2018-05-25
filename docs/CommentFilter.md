# CommentFilter 弹幕过滤器

弹幕过滤器是一套简便的弹幕过滤系统，可以用来调整用户显示的弹幕信息。目前版本的弹幕过滤器提供
了很多功能来辅助过滤弹幕。

在创建了 CommentManager 对象并初始化后，过滤器可以通过 `CommentManager.filter` 访问。
在文档内，将会用 `filter` 对象来表示 `CommentFilter` 的一个实例。

注意：过滤器在 `send()` 之前执行，所以通过 `send()` 派发的弹幕将不会通过 CommentFilter。
这同时表示直播弹幕等基于 `send()` 实现弹幕发送的方法不会直接自动调用弹幕过滤器。如果希望过滤
这些弹幕，需要手动调用过滤

## 手动调用过滤器 Invoking Filter
过滤器的 `doValidate` 方法用于判断弹幕是否应该被过滤，手动进行过滤只需把检测的弹幕送入
`filter.doValidate(cmt)` 即可。`true` 表示通过了过滤，这样则可以继续派发到 `send`。

## 过滤器语法 Filter Syntax
过滤器有两种方式过滤，其中基础过滤是模式黑/白名单而高级过滤列表是基于一系列规则的。

### 模式过滤 Mode Switches
模式过滤可以通过设置 `allowTypes` 选择显示或者抛弃的 mode 类型。默认配置下，mode
`1,2,4,5,6,7,8,17` 都是被允许的。如果需要过滤掉某个模式的弹幕（比如滚动弹幕 `1`），只要把
`allowTypes` 对应的属性设成 `false` 即可。

设置 `allowUnknownTypes` 可以决定列表外的类型默认处理方法（默认允许还是默认拒绝）。当设置为
`true`时，`allowTypes`内未定义操作的弹幕将被放行，否则默认进行过滤。

### 高级过滤列表 Advanced Rule List
高级过滤列表通过一系列规则过滤弹幕，每一个规则形式如下：

````JavaScript
{
    "subject": "",
    "op": "",
    "value": null,
    "mode": "accept" | "reject"
}
````

- Subject: (Subject) 规则绑定的对象
    比如 `subject=""` 时，则匹配整个 ICommentData 对象而 `subject="text"` 则匹配
    弹幕文字。可以通过 `.` 来进入子属性，比如 `subject="text.length"` 则会匹配
    `cmtData.text.length` (`cmtData` 为 ICommentData对象)。
- Op: (Operator) 规则使用的匹配方式
    - `<`/`>`: 数字匹配 (value为number)
    - `~` 或 `regexp`: 正则匹配 (value为正则表达式对象)
    - `=` 或 `eq`: 全等匹配 (value为任何对象)
    - `!` 或 `not`: 取反反规则，以前判定true则会返回false (value为 `rule`)
    - `&&` 或 `and`: 合并规则，只有列表中所有规则都匹配才匹配 (value为 `rule[]`)
    - `||` 或 `or`: 或合并规则，只要列表中有一个匹配则匹配 (value为 `rule[]`)
- Value: (Target value) 规则目标参考值
    根据 OP 的取值，可能代表不同含义
- Mode: (Rule mode) 规则类型
    - `accept`: 匹配规则才可放行（白名单）
    - `reject`: 匹配规则会被舍弃（黑名单）

示例：只显示文字长度为 20 以内的滚动弹幕，且弹幕中不允许一个连续的词出现超过3次，则可以添加
如下两个规则：

````JavaScript
var rule1 = {
    "subject": "",
    "op": "and",
    "value": [
      {
        "subject": "text.length",
        "op": "<",
        "value": 20,
      },
      {
        "subject": "mode",
        "op": "=",
        "value": 1,
      }
    ],
    "mode": "accept"
};
var rule2 = {
    "subject": "text",
    "op": "~",
    "value": "(.{2,})\1{2,}",
    "mode": "reject"
}
````

### 添加/删除规则 Adding/Removing Rules
规则可以通过 `addRule()` 添加规则，同时通过 `removeRule()` 删除添加了的规则。规则实例
可以通过 `filter.rules` 查询。

## 复杂
