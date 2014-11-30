# Including CCL 调用 CCL
以下仅供参考，且不包括如何架设脚本弹幕部分。如果还有更具体的问题，欢迎发邮件给我。

### 需要的文件 Required Files
编译好了的文件都在 `build/` 里面，架设时需要 `CommentCoreLibrary.js` 和 `style.css`。注意
还有一个`.min.*`版本，是压缩后的。如果你在开发CCL相关的平台，建议用未压缩的，因为出错了知道在哪行。
等开发完了就可以直接换用 `.min.*` 压缩版，节约流量提高页面载入速度啥的。

### 布置页面
CCL理论上可以绑定任何 `div` 元件，但是没有结构好的 `div` 下会产生很多问题。因此，在挂在 CCL 时
先保证有类似如下的 HTML 结构 

    <div class="container">
    </div>
    
注意，你可以通过别的属性叠加在 container 上，比如 `<div class='container' style="width:640px; height:480px;">`。

