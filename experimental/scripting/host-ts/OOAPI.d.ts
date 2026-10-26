export interface OOAPIMessage {
  channel:string;
  payload:any;
  auth?:string;
  callback?:boolean;
}

export interface LogMessage extends OOAPIMessage {
  mode:string;
  obj:any;
}
