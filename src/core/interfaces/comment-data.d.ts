export type CoordinateMode = 'absolute'|'relative';
export type Axis = 'top-left'|'top-right'|'bottom-left'|'bottom-right';

export interface UpdateablePosition {
  x?:number;
  y?:number;
  z?:number;
  mode?:CoordinateMode;
  axis?:Axis;
}

export interface Position extends UpdateablePosition {
  x:number;
  y:number;
  mode:CoordinateMode;
  axis:Axis;
}

export interface Orientation {
  rx?:number;
  ry?:number;
  rz?:number;
}

export interface Anchor {
  vertical:number;
  horizontal:number;
}

export interface Scale {
  x:number;
  y:number;
  z?:number;
}

export interface Animatable {
  position?:UpdateablePosition,
  orientation?:Orientation,
  scale?:Scale,
  color?:number;
  alpha?:number;
  size?:number;
}

export interface Waypoint extends Animatable {
  duration:number;
  interpolation:'none'|'linear';
}

export type AnimationMode =
  'scroll-left'|'scroll-right'|'fixed'|'single'|'path';

export interface AnimationData {
  duration:number;
  mode:AnimationMode;
  path?:Waypoint[];
}

export interface UpdateableCommentData extends Animatable {
  text?:string;
  font?:string | null;
  border?:boolean;
  outline?:boolean;
}

export interface CommentData extends UpdateableCommentData {
  startTime:number;
  text:string;
  font:string | null;
  size:number;
  color:number;
  alpha:number;
  border:boolean;
  outline:boolean;
  position:Position;
  orientation:Orientation;
  anchor:Anchor;
  scale:Scale;
  animation:AnimationData;
  date?:number;
  id?:string;
}
