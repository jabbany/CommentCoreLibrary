/// <reference path="OOAPI.d.ts" />
/**
* Player sound
*/
declare module Player {
}
declare module Player {
    var state: string;
    var time: string;
    var commentList: Object[];
    var refreshRate: number;
    var width: number;
    var height: number;
    var videoWidth: number;
    var videoHeight: number;
    var version: string;
    /**
    * Requests the player to start playing.
    */
    function play(): void;
    /**
    * Requests the player to pause
    */
    function pause(): void;
    /**
    * Seeks to a position (in milliseconds from start)
    * @param offset - milliseconds offset
    */
    function seek(offset: number): void;
    /**
    * Jump to another video
    * Note that this may not work if the Host policy does not allow it
    *
    * @param video - video id
    * @param page - video page (defaults to 1)
    * @param newWindow - open the video in a new window or not
    */
    function jump(video: string, page?: number, newWindow?: boolean): void;
    function commentTrigger(callback: Function, timeout: number): void;
    function keyTrigger(callback: Function, timeout: number): void;
    function setMask(mask: any): void;
    function toString(): string;
}
