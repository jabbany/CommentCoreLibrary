# 测试样本弹幕
测试样本弹幕文件大部分来自 bilibili.tv ，无其他声明，版权归原作者。所有样本都为实际采集取得，
未进行任何修饰/编辑。大部分样例文件取自[蓝白弹幕战]（的白组）。

## 测试样本说明
* `rokubunnoichi.xml`
    
    【六分之一】（av52094,6）基本定位弹幕，基本3D变化
    
* `unowen.xml`
    
    【緋色月下、狂咲ノ絶】（av52094,4）基本反向弹幕，定位弹幕和颜色渐变，同时测试弹幕饱和的处理。
    
* `test.xml`
    
    【Parachlorobenzene x Antichlorobenzene】（av52094,1）基本定位、渐变
     因为好听所以加上了
    
* `test2.xml`
    
    【Waka Laka】（av52094,5）基本定位，颜色，3D
    
* `mikunoshoushitu.xml`
    
    【初音未来的消失】复杂高级弹幕，各种功力测试，__基本能完全通过了__
    
* `extended.xml`
    
    【里表Lovers】复杂高级弹幕，各种功力测试，__基本能完全通过了__
    
* `comment.xml`
    
    基本滚动弹幕，高通量，测试过滤器用意
    
* `av207527.xml`
    
    大量滚动弹幕，高通量，测试性能
    
* `utsukushiki_mono.xml`
    
    【美丽之物】（av297197）测试复杂的3D旋转，高级弹幕性能测试

### Acfun
* `AcFun.json`
    
    测试AcFun弹幕解析（尚不完全）

* `ac940133.json`
    
    AcFun高级运动弹幕测试（更不完全）

### 脚本
脚本弹幕很多修正了语法错误，未定义参数的运用和各种BSE认为可以忍，普通浏览器JS认为不能忍的东西。
* `scripting/jinzou-enemy.xml`
    
    【人造Enemy】脚本弹幕（普通难度）测试，包括渐变和绘图
    
* `scripting/tsubasa.xml`
    
    【TSUBASA】脚本弹幕+高级弹幕（普通难度），包括绘图和渐变
    
* `scripting/kanpai.xml`，`scripting/kanpai-standards-compliant.xml`
    
    【Bilibili干杯！】脚本弹幕（中等难度）测试，包括绘图，滤镜
    【修正】修正成没有语法错误的，否则 JS 不解析
    
* `scripting/crazy-night.xml`
    
    【Crazy Night】脚本弹幕（高级难度）测试，包括3D旋转和复杂的Tween
    【修正】修正一些语法错误    
    
* `scripting/comment-festival-v3.xml`
    
    【第三回蓝百弹幕合作战】脚本弹幕+高级弹幕（超高难度），包括Akari库和大量的预载入处理，Bitmap
    等等听着就吓人的东西。
    
* `scripting/round-and-round.xml`
    
    【Round and Round】脚本弹幕（超高难度），包括Akari库和大量的遮罩
    

## 人工构造样本
* `bilibili.xml`
    
    借鉴 @chitosai 的测试样本。用于测字符画还原和滚动3D字。
    
* `invalid/*`
    
    测试弹幕解析器的松散解析模式
    
* `scripting/*.biliscript`
    
    测试代码弹幕的各种小脚本
