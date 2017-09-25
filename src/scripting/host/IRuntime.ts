export interface RuntimeRequest {
  id:string;
}

export interface MethodCallRequest extends RuntimeRequest {
  method:string;
  params:any[];
}
