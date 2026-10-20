/**
 * Tween Module for the Kagerou Engine worker
 * @author Jim Chen
 * @description Builds the Tween global
 */
import { createModule, exportGlobal } from './Module';
import * as TweenModule from './Tween/Tween';

var Tween = createModule(TweenModule);

exportGlobal('Tween', Tween);

/** TODO: Remove when unnecessary **/
Tween.extendWithEasingFunctions(self);
