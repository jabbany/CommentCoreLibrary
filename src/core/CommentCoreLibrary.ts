/**
 * Comment Core Library
 *
 * @author Jim Chen
 * @license MIT License
 * @description Comment management unit for CCL
 */
/// <reference path="Core.d.ts" />
class CommentManager implements ICommentManager {
    private _width:number = 0;
    private _height:number = 0;
    private _status:string = "stopped";
    private _stage:HTMLDivElement;
    private _listeners:Object = {};
    private _csa:Object = {};

    public options:CCLOptions = {
        "global": {
            "scale": 1,
            "opacity": 1,
            "className": "cmt"
        },
        "scroll": {
            "scale": 1,
            "opacity": 1
        }
    };
    public timeline:Array<Object> = [];
    public runline:Array<IComment> = [];
    public position:number = 0;

    get width():number {
        return this._width;
    }

    get height():number {
        return this._height;
    }

    get stage():HTMLDivElement {
        return this._stage;
    }

    get status():string {
        return this._status;
    }

    constructor(stage:HTMLDivElement) {
        this._stage = stage;
    }

    public static getCommentType(data:Object):string{
        return "";
    }

    /**
     * Start the comment manager
     */
    public start():void {
        this._status = "running";
    }

    /**
     * Stop the comment manager
     */
    public stop():void {
        this._status = "stopped";
    }

    /**
     * Load a list of comments into the time line
     * @param data - list of abstract comment data
     */
    public load(data:Array<Object>):void {
        this.timeline = data;

    }

    /**
     * Inserts an abstract comment data into the time line
     * @param data - abstract comment data
     */
    public insert(data:Object):void {

    }

    /**
     * Clears all comments managed from the stage
     */
    public clear():void {

    }

    /**
     * Sends a comment onto the stage
     * @param data - abstract comment data
     */
    public send(data:Object):void {

    }

    /**
     * Set the bounds for the comment manager
     * @param width - width value px
     * @param height - height value px
     */
    public setBounds(width:number = this.stage.offsetWidth, height:number = this.stage.offsetHeight):void {
        this._width = width;
        this._height = height;
        this.dispatchEvent("resize");
        for(var allocator in this._csa){
            if(this._csa.hasOwnProperty(allocator)){
                var csa:CommentSpaceAllocator = this._csa[allocator];
                csa.setBounds(this._width, this._height);
            }
        }
        this.stage.style.perspective = this.width * Math.tan(40 * Math.PI/180) / 2 + "px";
        // TODO: Remove webkit prefix
        this.stage.style["webkitPerspective"] = this.width * Math.tan(40 * Math.PI/180) / 2 + "px";
    }

    /**
     * Dispatches an event
     * @param name - event name
     * @param data - corresponding data
     */
    public dispatchEvent(name:String, data:Object = null):void {
        if (this._listeners.hasOwnProperty(name)) {
            var listenerList:Array<Function> = this._listeners[name];
            for (var i = 0; i < listenerList.length; i++) {
                try {
                    listenerList[i](data);
                } catch (e) {
                    console.warn(e);
                }
            }
        }
    }

    /**
     * Add an event listener
     * @param name - event name
     * @param listener - listener function
     */
    public addEventListener(name:String, listener:Function):void {
        if (this._listeners.hasOwnProperty(name)) {
            (Array<Function>)(this._listeners[name]).push(listener);
        } else {
            this._listeners[name] = [listener];
        }
    }

    public finish(cmt:IComment):void {

    }

}
