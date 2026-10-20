/**
 * Minimal stand-in for XMLHttpRequest so that specs never touch the network.
 * Requests are recorded but never answered.
 */
export class FakeXMLHttpRequest {
  public static requests:FakeXMLHttpRequest[] = [];

  public method:string = null;
  public url:string = null;
  public body:any = undefined;
  public responseType:string = '';
  public status:number = 0;
  public statusText:string = '';
  public response:any = null;
  public onload:Function = null;
  public onerror:Function = null;

  constructor() {
    FakeXMLHttpRequest.requests.push(this);
  }

  public open(method:string, url:string):void {
    this.method = method;
    this.url = url;
  }

  public send(body?:any):void {
    this.body = body;
  }
}
