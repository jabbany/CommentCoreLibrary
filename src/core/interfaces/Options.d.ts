import { ScriptingEngine } from './scripting-engine';

export interface TypeOptions {
  scale: number;
  opacity: number;
  classNames: string[];
}

export interface Options {
  global: TypeOptions;
  fixed: TypeOptions;
  scroll: TypeOptions;
  scripting:{
    modes: number[];
    engine: ScriptingEngine|null;
  }
}
