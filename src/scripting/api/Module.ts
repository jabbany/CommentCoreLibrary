/**
 * Kagerou Engine Module Helpers
 * @author Jim Chen
 * @description Helpers used by the bundle entries (api/<Module>.ts) to build
 *    the global objects that scripts in the worker interact with.
 */

/**
 * Creates the global object for an API module.
 *
 * @param {Object} members - module namespace whose members are copied
 * @param {PropertyDescriptorMap} properties - accessor properties to define.
 *        Like BiliScriptEngine, these are not enumerable. Members with the same
 *        name are replaced by these properties.
 * @returns {Object} the module object
 */
export function createModule<T>(members:T,
  properties:PropertyDescriptorMap = {}):T {

  var module:any = {};
  for (var key in members) {
    if (!properties.hasOwnProperty(key)) {
      module[key] = members[key];
    }
  }
  Object.defineProperties(module, properties);
  return <T> module;
}

/**
 * Exposes a value as a global in the worker
 *
 * @param {string} name - name of the global
 * @param {any} value - value to expose
 */
export function exportGlobal(name:string, value:any):void {
  self[name] = value;
}
