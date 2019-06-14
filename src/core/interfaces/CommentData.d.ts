export interface Position {
  x:number;
  y:number;
}

export interface Waypoint extends Position {
  interpolation:'none'|'linear';
}

export interface AnimationData {
  duration:number;
  mode:'none'|'scroll'|'path';
  path?:Waypoint[];
}

export interface UpdateableCommentData {
  text?:string;
  font?:string;
  size?:number;
  color?:number;
  alpha?:number;
  border?:boolean;
  shadow?:boolean;
  position?:Position;
  animation?:AnimationData;
}

export interface CommentData extends UpdateableCommentData{
  startTime:number;
  text:string;
  font:string;
  size:number;
  color:number;
  alpha:number;
  border:boolean;
  shadow:boolean;
  position:Position;
  animation:AnimationData;
  date?:number;
  id?:string;
}
