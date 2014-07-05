/**
 * Partially Compliant CommentData Adapter
 */
class CommentData {
	private _dbid = 0;

	constructor(comment:Object) {
		this._dbid = comment.dbid;
		this.size = comment.size;
		this.text = comment.text;
		this.mode = comment.mode;
		this.stime = comment.stime;
		this.date = comment.date;
	}

	public blocked:boolean = false;
	public blockType:number = 0;
	public border:boolean = false;
	public credit:boolean = false;

	get danmuId():number {
		return this._dbid;
	}

	public date:string = "";
	public deleted:boolean = false;
	public id:number = 0;
	public mode:number = 0;
	public msg:string = "";
	public live:boolean = true;
	public locked:boolean = true;
	public on:boolean = true;
	public pool:number = 0;
	public preview:boolean = false;
	public reported:boolean = false;
	public size:number = 25;
	public stime:number = 0;
	public text:string = "";
	public type:string = "";
	public uid:string = "";
}