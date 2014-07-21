/// <reference path="Runtime.d.ts" />
/**
* Easing functions for the Tween Library
* Adapted from Flash ActionScript
* http://www.robertpenner.com/easing/penner_chapter7_tweening.pdf
*/
declare module Tween {
    /**
    * Standard linear tween.
    * @param t - time *dynamic
    * @param b - begin value *static
    * @param c - change from b *static
    * @param d - duration of tween *static
    */
    function linear(t: number, b: number, c: number, d: number): number;
    function quadratic(t: number, b: number, c: number, d: number): number;
    function cubic(t: number, b: number, c: number, d: number): number;
    function quartic(t: number, b: number, c: number, d: number): number;
    function quintic(t: number, b: number, c: number, d: number): number;
    function circuar(t: number, b: number, c: number, d: number): number;
    function sine(t: number, b: number, c: number, d: number): number;
    function exponential(t: number, b: number, c: number, d: number): number;
    /**
    * Extends the input object with easing functions
    * @param runtime - Runtime to extend the easing function to
    */
    function extendWithEasingFunctions(runtime: any): void;
    function getEasingFuncByName(easing?: string): Function;
}
declare module Tween {
    class ITween {
        private _target;
        private _duration;
        private _isPlaying;
        private _currentTime;
        private _repeats;
        private _timer;
        public easing: Function;
        public step: Function;
        constructor(target: any, duration?: number);
        public duration : number;
        public position : number;
        public repeat : number;
        public target : any;
        public clone(): ITween;
        public scale(factor: number): void;
        public play(): void;
        public stop(): void;
        public gotoAndStop(position: number): void;
        public gotoAndPlay(position: number): void;
        public togglePause(): void;
    }
    function tween(object: any, dest?: Object, src?: Object, duration?: number, easing?: Function): ITween;
    function to(object: any, dest?: Object, duration?: number, easing?: Function): ITween;
    function beizer(): ITween;
    function scale(src: ITween, scale: number): ITween;
    function delay(src: ITween, delay: number): ITween;
    function reverse(src: ITween): ITween;
    function repeat(src: ITween, times: number): ITween;
    function slice(src: ITween, from: number, to: number): ITween;
    function serial(...args: ITween[]): ITween;
    function parallel(...args: ITween[]): ITween;
}
