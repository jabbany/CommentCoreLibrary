/**
 * General Host Engine for CCLScripter
 * Author: Jim Chen
 */
import type { StageElement, Logger, IPlayer, IScripter } from './IScripter';

import { BridgedSandbox } from './BridgedSandbox';

export class CCLScripter implements IScripter {
	public backendVersion:string = 'KagerouEngine/v1';
	public frontendVersion:string = 'KagerouHost/v1';
	public workerUrl:string;

	/** Setup default logger **/
	public logger:Logger = {
		log:(msg:any) => { console.log(msg); },
		error:(msg:any) => { console.error(msg); },
		warn:(msg:any) => { console.warn(msg); }
	};

	constructor(url:string) {
		this.workerUrl = url;
	}

	public getWorker():Worker {
		return new Worker(this.workerUrl);
	}

	public getSandbox(stage:StageElement, player:IPlayer):BridgedSandbox {
		return new BridgedSandbox(this, stage, player);
	}
}
