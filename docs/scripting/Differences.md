# Differences 阳炎引擎与BSE的区别
[简体中文](Differences.zh_CN.md)

KagerouEngine is built to mimic BilibiliScriptingEngine (BSE) however there are
many considerations when it comes to implementing ECMA scripting enviroments in
the browser. For example, scripts that are run on the page's context are able to
snatch cookies, mimic user actions or modify page elements. As such,
KagerouEngine is desinged to be run inside a Web Worker sandbox that can only
indirectly communicate with the Host page.

This has given rise to a few limitations in supporting the BSE API.

## Sandbox Limitations

A worker sandbox is not perfect. Scripts running inside still have access to the
potentially dangerous XMLHttpRequest API. To limit scripts' access to your own
domain, you can choose to host the worker files on a separate subdomain or
domain since the Same Origin Policy is still in effect for workers. This,
however, does not prevent the Script from sending out data to a server
controlled by a third party. The Script within the worker context only has as
much data as you feed it through the OOAPI. So it is possible to control data
leakage too.

## Compatibility Issues

Due to the CCLScripting Engine using only the messaging API. We cannot reliably
ask for synchronous state information and expect a prompt reply. This means that
we must use cached information at times.

Whenever we resort to using cached information due to a synchronous API, we will
try to compensate the diffence in cache if possible. For example, within the
`Player` api, there are many properties that show information about the player's
state. Most of these fields are cached. As a specific example, `Player.time` is
updated whenver a timeupdate is issued into the sandbox. Between the two issued
timeupdates, requesting for `Player.time` will return you the previous timestamp
plus the difference in time between when you recieved it and the current time.

This may cause the time to slightly decrease as timeupdates are recieved.

Similarly, the broadcast event `enterFrame` is also completely virtual as it is
not efficient enough to send drawing state into the sandbox at high frequencies.
More details on these compatibility problems are described in the corresponding
API docs.
