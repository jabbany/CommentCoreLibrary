### External
External libraries can be loaded through load(). `Bitmap` and `Storage` mimic behavior of `libBitmap` and `libStorage` in BiliScriptEngine. The rest should be high-level compatible with the BiliScriptEngine.

## Bitmap.js

Implements AS3 BitmapData.

## Storage.js

Implements remote storage support (as well as localstorage). It provides the entire API of BSE's `libStorage` alongside with extra functionality. Danmaku code can test if `Storage.localStorage === true` to determine if localStorage is supported.

## Base64.js

Base64 Decoder. Source compatible with BSE.

## Effects.js

Preset Effects. This uses native CCL optimizations so it is not recommended to be used with BSE.

## LZ.js

String compression library. Source compatible with BSE.

# UIKit.js

Simple kit for creating complex UI components. Partially source compatible with BSE.
