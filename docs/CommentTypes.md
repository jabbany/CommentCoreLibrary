# 弹幕类型说明
弹幕播放器自主支持以下类型的弹幕模式：
* 1 - 上端滚动弹幕
* 2 - 下端滚动弹幕
* 4 - 底部弹幕
* 5 - 顶部弹幕
* 6 - 逆向弹幕
* 7 - 定位弹幕
* 8 - 代码高级弹幕
* 9 - 预留 Zoome弹幕兼容性
* 17 - 图片定位弹幕
* 18 - Canvas/SVG定位弹幕（未完成）
* 19 - 绘图弹幕（未完成）
* 20 - 高阶定位混合弹幕组（实验性）
* 21 - 字幕弹幕
默认情况下，弹幕都必须包含：开始时间、字体大小、字体字号、颜色。

## 滚动弹幕
    可选参量：文字
滚动弹幕允许选择参量文字，文字允许（\n,/n）换行

## 底部弹幕
    可选参量：文字
底部弹幕允许参量文字。不受界面全局的透明度影响。

## 顶部弹幕
    可选参量：文字
顶部弹幕允许指定内容文字。不受界面全局的透明度影响。

## 逆向弹幕
    可选参量：文字
逆向弹幕允许指定文字，受全局透明度影响。

## 定位弹幕
### 定位弹幕简单模式
    可选参量：Array[x,y,opacity,duration,text]
定位弹幕简单模式允许用户对弹幕进行精确定位和透明度渐变，但是本身不包含任何3D排版效果。opacity为形如：```[Float]-[Float]```，分别定义了始末透明度。x,y都小于1的时候我们认为是百分比。

### 定位弹幕扩展模式
    可选参量：Array[x,y,opacity,duration,text,rotateZ,rotateY]
定位弹幕扩展模式允许用户对弹幕进行旋转的3维操作，3维旋转中心默认为左上角0% 0%位置，沿物体本身各轴的旋转X=0 (deg) Y=rotateY (deg) Z=rotateZ (deg)。
注意这里没有移动效果。

### 定位移动弹幕模式
    可选参量：Array[x,y,opacity,duration,text,rotateZ,rotateY,toX,toY,(dur),(delay),(shadow),(font),(linear)]
定位移动弹幕允许用户指定了扩展弹幕后进行移动，由初始位置(x,y)线性移动到(toX,toY)，同时 dur 表示整个移动的时长（默认500ms），delay 表示移动的滞后时间（默认为0ms)。
定位移动开始于弹幕生命周期的delay，并完结于生命周期的 (delay+dur) 时间。如果(delay+dur)>duration，则移动会在duration到达时终止（注意此时可能并未到达移动终点）
定位弹幕的Shadow为"true"或"false"字符串，若为false则文字不钩边。font如果指定，则会改变当前弹幕的字体。linear目前暂时不起作用。

## 代码弹幕
### 标准代码弹幕
    可选参量：代码
定义一条代码弹幕。代码会在弹幕开始时被执行，并且被局限于一个弹幕的运行时空间。有关代码弹幕请参考 [scripting](scripting/readme.md) 章节。CCL的代码弹幕实现与Bilibili 高级弹幕的API有兼容层，这表示一些Bilibili的高级弹幕可以无须更改的运行在 CCL代码弹幕引擎上。另一些代码弹幕则需少量的更改（或者视情况可能需要一些结构重构）。

### 非标准代码弹幕
    可选参量：代码
由于代码弹幕的可塑性，并不是所有的实现都会兼容同一套API。此处的内容需要视具体实现而定。


## 图片定位弹幕
### 标准模式
    可选参量：Array[x,y,opacity,duration,url]
图片定位弹幕允许用户进行图片弹幕的动态载入，其中(x,y)为显示坐标，opacity为形如```[Float]-[Float]```的渐变区段，而duration为生命周期。

### 扩展形式
    可选参量：Array[x,y,opacity,duration,url,rotX,rotY,rotZ,(originTL),(imgScale)]
图片弹幕的扩展格式比文字弹幕要更加灵活。imgScale定义了图片缩放比例```[Width]x[Height]```，默认为原始大小。为"0x0"时也等同于默认大小。
rotX,rotY,rotZ则分别定义了图片在X,Y,Z轴向的转动量。
originTL是一个形如`[originT%]-[originL%]`的字符串，其定义了一下旋转中心距离左上角的位置，默认是"0% 0%"处（等同于参数"0-0"），旋转中心为整个图形的中心时，可用"50-50"参数。右下角则是"100-100"

### 扩展可动模式
    可选参量：Array[x,y,opacity,duration,url,rotX,rotY,rotZ,originTL,imgScale,toX,toY,delay,dur,(toScale)]
图片弹幕的扩展可动模式为最为灵活的模式。其中originTL和imgScale为必选参数。toX,toY为目标位置，delay为延时，dur为移动时长。
toScale为形如"[Int]x[Int]"的参数，标记了缩放末位置的大小。缩放运动与渐变运动相同，为全过程运动，不受delay & dur的影响。

## 高阶定位混合弹幕组
    可选设置：Object
高阶定位将支撑一个“定位体”（Position Effect Element），在可能的情况下最大限度的允许用户进行发挥。

    {
        "start":[0,0],
        "object":{"value":"This is only a Test Run","mode":"text"},
        "ttl":5000,
        "effects":[
            {en:}
        ],
    }
    
说明如下：

    $.start为一个数组，定义了(x,y)坐标，当 x,y中一方小于0时，则按照舞台另一端进行运动。（假定窗口为640x480，则[-50,-50]的弹幕初始位置是 590,430）
    $.object为一个移动体，移动体有如下几种模式(mode)：
        "text":纯文字
        "img":图片链接网址
        "html":HTML代码（注意，此项危险，一般不启用）
        "md":简单排版的文字（ "*文字*"->粗体 "__文字__"->斜体 "--文字--"->划掉 "[文字](http://)"->连接。
        "richtext":单元排版文字，数组，形如 [[文字,css],[文字,css]...]
        "div":一个HTML的DIV单体，参数为 CSS 。
    $.ttl为整个效果的生命周期，任何在生命周期内没有完成的效果都将没有机会完成。当ttl为0时，弹幕将不会被渲染。
    $.effects为一个效果集群
        Type[animate],参数：(what,from,to,start,duration)  线性动画效果
		    what<-['color','x-y','w-h','fontSize','opacity']
		Type[expr],参数：(what,expression,start,duration)
		    非线性参数定制
			what<-['x','y','opacity','rotX','rotY','rotZ','fontSize','width','height']
			expression : "(i+(9*sin(i)))+1"一类的表达式，注意 表达式里面允许函数 sqrt,pow,min,max,sin,cos,tan,asin,acos,atan,floor,ceil
			  注意：表达式的变量总取 i
	    Type[set],参数：(object,start)
		    设定内容物Object为新的object。
		Type[native],参数：(jsCode,start)
		    运行代码，注意Native模式不安全，也未必被支持。

## Canvas/SVG弹幕
无完整的Spec.

## 绘图弹幕
无完整的实现Spec.

## 字幕弹幕
部分兼容 ASS 字幕文件
