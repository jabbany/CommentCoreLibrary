Runtime
===================

.registerObject(<String> objectId)
-------------------
Registers an object to be tracked by the runtime.

.registerListener(<String> objectId, <String> listenerId)
-------------------
Registers a listener to be tracked by the runtime. When an object is removed
all of its listeners are removed. If a listener is operating without an object
(in case of `delay` and `interval`, their parent is `__self` which does not
exist within the scope of the objects)

.cleanup()
-------------------
If all objects and listeners have been deregistered, we perform a cleanup and 
end the current worker. We notify the higher process.

Overriding
===================
You may override methods in Runtime or itself BUT be aware that if you do so you
will need to manually handle the termination of the worker instance. DO NOT leave
worker instances running as they will fill up the worker pool.
