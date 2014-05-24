/* *****************************************************************************
Copyright (c) 2014 Jim Chen

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
***************************************************************************** */

////////////////
/// OOAPIs
////////////////

declare function __trace(message:string, type:string):void;
declare function __channel(id:string, payload:Object, callback:Function):void;
declare function __pchannel(id:string, payload:Object):void;
declare function __schannel(id:string, callback:Function):void;
declare function __achannel(id:string, auth:string, payload:Object):void;

declare var __OOAPI:{
	createChannel(id:string, max?:number, token?:string):boolean;
	deleteChannel(id:string, token?:string):boolean;
	addListenerChannel(id:string, listener:Function):boolean;
}