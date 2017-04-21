# Bilibili 弹幕XML 粗略解析定义文档
以下为探索出的 Bilibili 弹幕格式定义。目前 CommentCoreLibrary 可以还原这个格式下的大部分定义。
不过由于有的定义是猜测的，所以还原后效果可能并不完全等同原始播放器。

## 格式范例

    <?xml version="1.0" encoding="UTF-8"?>
    <i>
      <chatserver>chat.bilibili.tv</chatserver>
      <chatid>91236</chatid>
      <source>k-v</source>
      <d p="##,#,##,######,######,#,....,########">...</d>
    </i>
    
## 普通部分
普通弹幕文字为 `d` 标签内的text部分，参数取自 `p` 属性，顺序如下:

1. stime: 弹幕出现时间 (s)
2. mode: 弹幕类型 (`< 7` 时为普通弹幕)
3. size: 字号
4. color: 文字颜色
5. date: 发送时间戳
6. pool: 弹幕池ID
7. author: 发送者ID
8. dbid: 数据库记录ID（单调递增）

## 高级弹幕 `innerText`
当 `mode >= 7`时，弹幕为高级弹幕，text部分为JSON对象。根对象是一个数组，属性按照出没顺序

### 基础属性
1. x 坐标: 整数时是绝对坐标，浮点时表示相对坐标
2. y 坐标: 整数时是绝对坐标，浮点时表示相对坐标
3. alpha 渐变: 格式 `start-end` 的字符串表示透明度渐变
4. duration 生存周期: 弹幕生存时间，默认 2500ms
5. text: 文字

### 3D弹幕属性
6. (OPT) rotation Y: 可选，y坐标轴旋转，单位: deg
7. (OPT) rotation Z: 可选，z坐标轴旋转，单位: deg

### 动画弹幕属性
8. (OPT) target X: 可选，目标x坐标
9. (OPT) target Y: 可选，目标y坐标 
10. (OPT) animation duration: 动画生存时间
11. (OPT) animation delay: 动画启动延迟
12. (OPT) shadow: 是否显示阴影
13. (OPT) font: 字体名称

### 路径弹幕属性
14. (OPT) ? 未知？ 猜测是补间方式(0=线形easing？)
15. (OPT) path: 动画路径

