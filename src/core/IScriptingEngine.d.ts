/**
 * Defines the interface for a ScriptingEngine
 */
export interface IScriptingEngine {
  /**
   * Evaluates code
   */
  eval(code:String):void;
}
