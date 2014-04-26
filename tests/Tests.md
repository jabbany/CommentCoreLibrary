# 测试样本弹幕
测试样本弹幕文件大部分来自 bilibili.tv ，无其他声明，版权归原作者。所有样本都为实际采集取得，未进行任何修饰/编辑。大部分样例文件取自[蓝白弹幕战]（的白组）。

## 测试样本说明
* rokubunnoichi.xml - 基本定位弹幕，基本3D变化
* unowen.xml - 基本反向弹幕，定位弹幕和颜色渐变，同时测试弹幕饱和的处理。
* test.xml - 基本定位、渐变，来自：av52094,1 因为好听所以加上了
* test2.xml - 基本定位，颜色，3D，来自：av52094,5
* mikunoshoushitu.xml - 逆天的弹幕，各种功力测试，__基本能完全通过了__
* comment.xml - 基本滚动弹幕，高通量，测试过滤器用意
* AcFun.json - 测试AcFun弹幕解析（尚不完全）
* kanpai.xml - 脚本弹幕（中等难度）测试。目前无法靠谱的还原各种光晕/模糊过滤器效果。【修正】修正成没有语法错误的，否则 JS 不解析
* kanpai-standards-compliant.xml - 脚本弹幕测试。【修正】修正成符合代码标准的
* utsukushiki_mono.xml - 测试复杂 3d旋转 来自：av297197

## 人工构造样本
（未出）
* filter.xml - 各种模式下的弹幕不断重复，来测试过滤器和合并器。
* scripting.xml (尚无) - 用于调戏高级脚本、图片、Canvas弹幕。
* image.xml - 图片弹幕专用测试。
* native.json - 播放器的原生模式，这个可以由解析后的timeline dump产生。
