Runtime
===================

.registerObject(&lt;String&gt; objectId)
-------------------
Registers an object to be tracked by the runtime.

.registerListener(&lt;String&gt; objectId, &lt;String&gt; listenerId)
-------------------
Registers a listener to be tracked by the runtime. When an object is removed
all of its listeners are removed. If a listener is operating without an object
(in case of `delay` and `interval`, their parent is `__self` which does not
exist within the scope of the objects)

.deregisterListener(&lt;String&gt; objectId, &lt;String&gt; listenerId)
-------------------
Deregisters a listener tracked by the runtime. Useful for when `delay` and `interval`
finish. 

.getObject(&lt;String&gt; object id)
-------------------
Get an object by its id value. This id is unique and is used in intercommunication!

.generateIdent()
-------------------
Generates a new id to use in a new object. Will never collide with an old id.


.cleanup()
-------------------
If all objects and listeners have been deregistered, we perform a cleanup and 
end the current worker. We notify the higher process.

Overriding
===================
You may override methods in Runtime or itself BUT be aware that if you do so you
will need to manually handle the termination of the worker instance. DO NOT leave
worker instances running as they will fill up the worker pool.
