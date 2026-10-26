/**
 * Utils Module for the Kagerou Engine worker
 * @author Jim Chen
 * @description Builds the Utils global and its global shorthands
 */
import { createModule, exportGlobal } from './Module';
import * as UtilsModule from './Utils/Utils';

var Utils = createModule(UtilsModule);

exportGlobal('Utils', Utils);
exportGlobal('getTimer', Utils.getTimer);
exportGlobal('interval', Utils.interval);
exportGlobal('timer', Utils.timer);
