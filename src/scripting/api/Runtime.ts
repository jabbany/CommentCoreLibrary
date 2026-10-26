/**
 * Runtime Module for the Kagerou Engine worker
 * @author Jim Chen
 * @description Builds the Runtime global (and the ScriptManager global used by
 *    BiliScriptEngine scripts)
 */
import { createModule, exportGlobal } from './Module';
import * as RuntimeModule from './Runtime/Runtime';

var Runtime = createModule(RuntimeModule, {
  'registeredObjects': {
    get: function () {
      return RuntimeModule.registeredObjects;
    },
    set: function (_value) {
      __trace('Runtime.registeredObjects is read-only', 'warn');
    }
  }
});

exportGlobal('Runtime', Runtime);
exportGlobal('ScriptManager', Runtime._defaultScriptManager);
