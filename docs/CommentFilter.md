# CommentFilter 弹幕过滤器

弹幕过滤器是一套简便的弹幕过滤系统，可以用来调整用户显示的弹幕信息。目前版本的弹幕过滤器提供
了很多功能来辅助过滤弹幕。

注意：过滤器在 `send()` 之前执行，所以通过 `send()` 派发的弹幕将不会通过 CommentFilter。

## 过滤器语法 Filter Syntax
过滤器有两种方式过滤，其中基础过滤是模式黑/白名单而高级过滤列表是基于一系列规则的。

### 模式过滤 Mode Switches
模式过滤可以通过设置 `allowTypes` 选择显示或者抛弃的 mode 类型。`allowUnknownTypes` 则
决定了列表外的类型默认处理方法（默认允许还是默认拒绝）

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
    - `NOT`: 取反反规则，以前判定true则会返回false (value为 `rule`)
    - `AND`: 合并规则，只有列表中所有规则都匹配才匹配 (value为 `rule[]`)
    - `OR`: 或合并规则，只要列表中有一个匹配则匹配 (value为 `rule[]`)
- Value: (Target value) 规则目标参考值
    根据 OP 的取值，可能代表不同含义
- Mode: (Rule mode) 规则类型
    - `accept`: 匹配规则才可放行
    - `reject`: 匹配规则会被舍弃
