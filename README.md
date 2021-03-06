# BinaryPacker0x0003.js [![Build Status](https://travis-ci.org/uupaa/BinaryPacker0x0003.js.png)](http://travis-ci.org/uupaa/BinaryPacker0x0003.js)

[![npm](https://nodei.co/npm/uupaa.binarypacker0x0003.js.png?downloads=true&stars=true)](https://nodei.co/npm/uupaa.binarypacker0x0003.js/)

APNGDecoder pack/unpack for BinaryPacker.js

## Document

- [BinaryPacker0x0003.js wiki](https://github.com/uupaa/BinaryPacker0x0003.js/wiki/BinaryPacker0x0003)
- [WebModule](https://github.com/uupaa/WebModule)
    - [Slide](http://uupaa.github.io/Slide/slide/WebModule/index.html)
    - [Development](https://github.com/uupaa/WebModule/wiki/Development)

## How to use

### Browser

```js
<script src="lib/BinaryPacker0x0003.js"></script>
<script>
    var formatID = 0x0003; // APNGDecoder
    var frameData = [
            new APNGFrameData(0, 1, 2, 3, 4, 5.5, 6, 7),
            new APNGFrameData(0, 1, 2, 3, 4, 5.5, 6, 7),
            new APNGFrameData(0, 1, 2, 3, 4, 5.5, 6, 7),
        ];
    frameData[0]._pixels = new Uint8Array([10, 11, 12, 13]);
    frameData[1]._pixels = new Uint8Array([20, 21, 22, 23, 24,]);
    frameData[2]._pixels = new Uint8Array([30, 31, 32, 33, 35, 36]);

    var source = {
            "apng": true,
            "width": 2,
            "height": 3,
            "loopCount": 4,
            "usePosterFrame": true,
            "backgroundColor": 0xffeedd,
            "frameData": frameData,
        };

    var packed = BinaryPacker.pack(source, formatID);
    var result = BinaryPacker.unpack(packed);

    if (source.apng === result.apng &&
        source.width === result.width &&
        source.height === result.height &&
        source.loopCount === result.loopCount &&
        source.usePosterFrame === result.usePosterFrame &&
        source.backgroundColor === result.backgroundColor &&
        source.frameData.length === result.frameData.length &&
        source.frameData[0]._pixels[0] === result.frameData[0]._pixels[0] &&
        source.frameData[0]._pixels[1] === result.frameData[0]._pixels[1] &&
        source.frameData[0]._pixels[2] === result.frameData[0]._pixels[2] &&
        source.frameData[0]._pixels[3] === result.frameData[0]._pixels[3]) {

        console.log("OK");
    } else {
        console.log("NG");
    }

</script>
```

### WebWorkers

```js
importScripts("lib/BinaryPacker0x0003.js");

...
```

### Node.js

```js
var BinaryPacker0x0003 = require("lib/BinaryPacker0x0003.js");

...
```
