/**
 * Core Definitions file
 */

interface IBinArray {
    binsert(arr:Array<any>, inserted:any, how:Function):number;
    bsearch(arr:Array<any>, what:any, how:Function):number;
}
declare var BinArray:IBinArray;

interface CCLOptions {
    global:{
        scale: number;
        opacity: number;
        className: string;
    }
    scroll:{
        scale:number;
        opacity:number;
    }
}

interface CommentManager {
    width:number;
    height:number;
    options:CCLOptions;
    finish(c:IComment):void;
}

interface IMotion {
    from:number;
    to:number;
    delay:number;
    dur:number;
    ttl:number;
    easing:Function;
}

interface IComment {
    dom:any;
    stime:number;
    dur:number;
    ttl:number;
    cindex:number;
    align:number;
    x:number;
    y:number;
    bottom:number;
    right:number;
    width:number;
    height:number;
    movable:boolean;
    border:boolean;
    shadow:boolean;
    font:string;
    color:number;
    alpha:number;
    size:number;
    time(t:number):void;
    update():void;
    invalidate():void;
    animate():void;
}
