/**
* Runtime Internal Module
* @author Jim Chen
*/
export * from './ObjectRegistry';
export * from './Timer';
export * from './ScriptManager';
export * from './Permissions';
export * from './Supports';
export * as NotCrypto from './NotCrypto';

/**
 * Invoke termination of script from outside the sandbox
 */
export function crash():void {
  __trace("Runtime.crash() : Manual crash", "fatal");
}

/**
 * Invoke graceful exit of script engine
 */
export function exit():void{
  __achannel("::worker:state", "worker", "terminated");
  self.close();
}

/**
 * Attempts to invoke an alert dialog.
 * Note: that this may not work if the Host policy does not allow it
 * @param {string} msg - message for alert
 */
export function alert(msg:string):void {
  __achannel("Runtime::alert", "::Runtime", msg);
}
