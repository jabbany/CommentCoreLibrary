/**
 * General Host Engine for CCLScripter
 * Author: Jim Chen
 */
interface Logger{
	log(msg:any):void;
	error(msg:any):void;
	warn(msg:any):void;
}

export class CCLScripting{
	public version:number = 1;
	public workerUrl:string;
	public logger:Logger = {
		log:(msg:any) => {console.log(msg);},
		error:(msg:any) => {console.error(msg);},
		warn:(msg:any) => {console.warn(msg);}
	};

	constructor(url:string){
		this.workerUrl = url;
	}

	public getWorker():Worker{
		return new Worker(this.workerUrl);
	}

	public getScriptingContext(){

	}

	public getSandbox(){

	}
}