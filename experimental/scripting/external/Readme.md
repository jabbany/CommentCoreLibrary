### External
External libraries were meant to be loaded through load(). `Storage` mimics the
behavior of `libStorage` in BiliScriptEngine. The rest should be high-level
compatible with the BiliScriptEngine.

None of these libraries are built or shipped yet.

## Storage.js

Stub. Intended to implement remote storage support (as well as localstorage)
with the entire API of BSE's `libStorage`. Danmaku code could test if
`Storage.localStorage === true` to determine if localStorage is supported.

## Base64.ts

Base64 Decoder. Source compatible with BSE.

## LZ.js

Stub. Intended as a string compression library, source compatible with BSE.

## Typo.ts

Defines common typos (e.g. `ture`, `flase`) so that scripts using them still
run. To be included before an offending script.

## WindowCanvas.ts

Window-like containers for scripts. Imports the Runtime module from
`src/scripting/api` (the relative import needs updating if this is revived).
