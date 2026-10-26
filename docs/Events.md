# 管理器事件 CommentManager Events
管理器的事件可以由 `addEventListener(event, listener)` 绑定，由 `dispatchEvent(event, data)` 
派发。

## 基础事件 (Basic Events)
- `load`
    
    此事件在调用 `load` 并且成功载入弹幕时间轴后被派发
    
- `insert`
    
    此事件在调用 `insert` 把弹幕插入时间轴后被派发
    
- `remove`
    
    此事件在调用 `remove` 从时间轴删除弹幕后被派发
    
- `destroy`
    
    此事件在调用 `destroy` 时、清除所有监听器之前被派发
    
- `clear`
    
    此事件在调用 `clear` 并且成功清除屏幕弹幕后被派发
    
- `resize`
    
    此事件在调用 `setBounds` 后被派发
    
- `enterComment`
    
    （数据参数：弹幕本体）在弹幕进入运行列表的时候派发
    
- `exitComment`
    
    （数据参数：弹幕本体）在弹幕消亡前派发
    
