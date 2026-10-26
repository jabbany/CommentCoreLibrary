import * as Runtime from '../Runtime/Runtime';
import type { CommentData } from '../CommentData';

export * from './Sound';

/**
 * Player Library
 * @author Jim Chen
 * @description The read-only properties of the Player (state, time, ...) are
 *    defined on the Player global (see ../Player.ts)
 */

/**
 * Requests the player to start playing.
 */
export function play():void {
  __pchannel("Player::action", {
    "action":"play"
  });
}

/**
 * Requests the player to pause
 */
export function pause():void {
  __pchannel("Player::action", {
    "action":"pause"
  });
}

/**
 * Seeks to a position (in milliseconds from start)
 * @param offset - milliseconds offset
 */
export function seek(offset:number):void {
  __pchannel("Player::action", {
    "action": "seek",
    "params": offset
  });
}

/**
 * Jump to another video
 * Note that this may not work if the Host policy does not allow it
 *
 * @param video - video id
 * @param page - video page (defaults to 1)
 * @param newWindow - open the video in a new window or not
 */
export function jump(
  video:string,
  page:number = 1,
  newWindow:boolean = false):void {

  __pchannel("Player::action", {
    "action": "jump",
    "params": {
      "vid":video,
      "page":page,
      "window":newWindow
    }
  });
}

export function commentTrigger(callback:Function, timeout:number):void{
  if (!Runtime.hasObject('__player')) {
    __trace('Your environment does not support player triggers.', 'err');
    return;
  }
  if (timeout < 0) {
    return;
  }
  var listener = function (comment:CommentData) {
    callback(comment);
  };
  var player:Runtime.IMetaObject =
    Runtime.getObject<Runtime.IMetaObject>('__player');
  player.addEventListener('comment', listener);
  //TODO: remove the listener after timeout
  //player.removeEventListener('comment', listener);
}

export function keyTrigger(callback:Function,
  timeout:number = 1000,
  triggerOnUp:boolean = false):void{
  if (!Runtime.hasObject('__player')) {
    __trace('Your environment does not support key triggers.', 'err');
    return;
  }
  if (timeout < 0) {
    return;
  }
  var eventName:string = 'key' + (triggerOnUp ? 'up' : 'down');
  var listener:(number)=>void = function (key) {
    callback(key.keyCode);
  };
  var player:Runtime.IMetaObject =
    Runtime.getObject<Runtime.IMetaObject>('__player');
  player.addEventListener(eventName, listener);
  //TODO: remove the listener after the timeout
  //player.removeEventListener(eventName, listener);
}

export function setMask(_mask:any):void{
  __trace('Masking not supported yet', 'warn');
}

export function toString(){
  return '[player Player]';
}
