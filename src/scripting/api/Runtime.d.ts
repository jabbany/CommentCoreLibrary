/// <reference path="OOAPI.d.ts" />
/**
* AS3 Like Timer Control for Runtime
*/
declare module Runtime {
    /**
    * Timers interface similar to AS3
    */
    class Timer {
        private _repeatCount;
        private _delay;
        private _microtime;
        private _timer;
        private _listeners;
        private _complete;
        public currentCount: number;
        constructor(delay: number, repeatCount?: number);
        public isRunning : boolean;
        public start(): void;
        public stop(): void;
        public reset(): void;
        public addEventListener(type: string, listener: Function): void;
        public dispatchEvent(event: string): void;
    }
    /**
    *  Get the master timer instance
    */
    function getTimer(): any;
    /**
    * Update the rate in which the enterFrame event is broadcasted
    * This synchronizes the frameRate value of the Display object.
    * By default, the frame rate is 24fps.
    */
    function updateFrameRate(frameRate: number): void;
}
/**
* Runtime permissions
*/
declare module Runtime {
    function requestPermission(name: string, callback?: Function): void;
    function hasPermission(name: string): boolean;
    function openWindow(url: string, params?: any, callback?: Function): void;
    function injectStyle(referenceObject: string, style: Object): void;
    function privilegedCode(): void;
}
declare module Runtime {
    interface RegisterableObject {
        getId(): string;
        dispatchEvent(event: string, data?: any): void;
        serialize(): Object;
    }
    var registeredObjects: Object;
    /**
    * Checks to see if an object is registered under the id given
    * @param objectId - Id to check
    * @returns {boolean} - whether the objectid is registered
    */
    function hasObject(objectId: string): boolean;
    /**
    * Gets the object registered by id
    * @param objectId - objectid of object
    * @returns {any} - object or undefined if not found
    */
    function getObject(objectId: string): any;
    /**
    * Registers an object to allow two way communication between the API
    * and the host.
    * @param object - object to be registered. Must have getId method.
    */
    function registerObject(object: RegisterableObject): void;
    /**
    * De-Registers an object from the runtime. This not only removes the object
    * from the stage if it is onstage, but also prevents the element from
    * receiving any more events.
    *
    * @param objectId - objectid to remove
    */
    function deregisterObject(objectId: string): void;
    /**
    * Generates an objectid that isn't registered
    * @param type - object type
    * @returns {string} - objectid that has not been registered
    */
    function generateId(type?: string): string;
    /**
    * De-registers all objects. This also unloads them. Objects
    * will not receive any more events
    */
    function reset(): void;
    /**
    * Unloads all objects. Does not deregister them, so they may
    * still receive events.
    */
    function clear(): void;
    /**
    * Invoke termination of script
    */
    function crash(): void;
    /**
    * Invoke exit of script engine
    */
    function exit(): void;
    /**
    * Attempts to invoke an alert dialog.
    * Note that this may not work if the Host policy does not allow it
    * @param msg - message for alert
    */
    function alert(msg: string): void;
}
