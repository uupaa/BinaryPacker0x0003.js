(function(global) {
"use strict";

// --- dependency modules ----------------------------------
var BinaryPacker  = global["BinaryPacker"];
var APNGFrameData = global["APNGFrameData"];

// --- define / local variables ----------------------------
//var _runOnNode = "process" in global;
//var _runOnWorker = "WorkerLocation" in global;
//var _runOnBrowser = "document" in global;

// --- class / interfaces ----------------------------------
function BinaryPacker0x0003() {
}

//{@dev
BinaryPacker0x0003["repository"] = "https://github.com/uupaa/BinaryPacker0x0003.js"; // GitHub repository URL. http://git.io/Help
//}@dev

BinaryPacker0x0003["pack"]          = BinaryPacker0x0003_pack;          // BinaryPacker0x0003.pack(source:Any):Uint8Array
BinaryPacker0x0003["unpack"]        = BinaryPacker0x0003_unpack;        // BinaryPacker0x0003.unpack(source:Uint8Array, head:Object = null):Any
BinaryPacker0x0003["getBodyLength"] = BinaryPacker0x0003_getBodyLength; // BinaryPacker0x0003.getBodyLength(source:Any):Integer

// --- implements ------------------------------------------
function BinaryPacker0x0003_getBodyLength(source) { // @arg Object - { apng, width, height, loopCount, usePosterFrame, backgroundColor, frameData }
                                                    // @ret Integer
// head part
//  | bytes | keyword      | value                               |
//  |-------|--------------|-------------------------------------|
//  | 2     | signature    | "BP"       [0x42, 0x50]             |
//  | 2     | formatID     | 0x0003     [0x00, 0x03]             |
//  | 4     | bodyLength   | 0xaabbccdd [0xaa, 0xbb, 0xcc, 0xdd] |
//
// body part
//  | bytes | keyword             |                                     |
//  |-------|---------------------|-------------------------------------|
//  | 1     | apng                | 0 or 1                              |  --+
//  | 2     | width               | 0 ~ 0xffff                          |    |
//  | 2     | height              | 0 ~ 0xffff                          |    |
//  | 1     | loopCount           | 0 ~ 0xff                            |    +---  12bytes
//  | 1     | usePosterFrame      | 0 or 1                              |    |
//  | 3     | backgroundColor     | 0x000000 ~ 0xffffff                 |    |
//  | 2     | frameDataLength     | 0 ~ 0xffff                          |  --+
//  | 4     | frameData[i].length | 0 ~ 0xffffffff                      |
//  | ?     | frameData[i]        | {{BinaryPacker0x0002}}              |
//
    var headLength = 8;
    var bodyLength = 12;
    var frameData = source["frameData"];
    var i = 0, iz = frameData.length;

    for (; i < iz; ++i) {
        var bytes = headLength + frameData[i]["getBodyLength"](); // head + body

        bodyLength += 4;     // frameDataLength(4byte)
        bodyLength += bytes; // frameData.length
    }
    return bodyLength;
}

function BinaryPacker0x0003_pack(source) { // @arg Object - { apng, width, height, loopCount, usePosterFrame, backgroundColor, frameData }
                                           // @ret Uint8Array - buffer
//{@dev
    $valid($type(source, "Object"), BinaryPacker0x0003_pack, "source");
//}@dev

    var headLength = 8;
    var bodyLength = BinaryPacker0x0003_getBodyLength(source);
    var buffer = new Uint8Array(headLength + bodyLength);
    var cursor = BinaryPacker["writeHead"](buffer, 0, bodyLength, 0x0003);
    var frameData = source["frameData"];
    var frameDataLength = frameData.length;
    var backgroundColor = source["backgroundColor"];
    var body = [
            +source["apng"],
            (source["width"]  >> 8) & 0xff,
             source["width"]        & 0xff,
            (source["height"] >> 8) & 0xff,
             source["height"]       & 0xff,
             source["loopCount"],
            +source["usePosterFrame"],
            (backgroundColor >> 16) & 0xff,
            (backgroundColor >>  8) & 0xff,
             backgroundColor        & 0xff,
            (frameDataLength >>  8) & 0xff,
             frameDataLength        & 0xff
        ];

    buffer.set(body, cursor);
    cursor += body.length;

    for (var i = 0; i < frameDataLength; ++i) {
        var bytes = headLength + frameData[i]["getBodyLength"](); // head + body

        buffer.set([(bytes >>> 24) & 0xff,
                    (bytes >>  16) & 0xff,
                    (bytes >>   8) & 0xff,
                     bytes         & 0xff], cursor);
        cursor += 4;
        buffer.set(frameData[i]["pack"](), cursor);
        cursor += bytes;
    }
    return buffer;
}

function BinaryPacker0x0003_unpack(source, // @arg Uint8Array
                                   head) { // @arg Object = null
                                           // @ret Object - { apng, width, height, loopCount, usePosterFrame, backgroundColor, frameData }
//{@dev
    $valid($type(source, "Uint8Array"),  BinaryPacker0x0003_unpack, "source");
    $valid($type(head,   "Object|null"), BinaryPacker0x0003_unpack, "head");
//}@dev

    head = head || BinaryPacker["readHead"](source);
    if (head && head["formatID"] === 0x0003) {

        var cursor = head["cursor"];
        var apng = !!source[cursor++];
        var width = source[cursor++] << 8 | source[cursor++];
        var height = source[cursor++] << 8 | source[cursor++];
        var loopCount = source[cursor++];
        var usePosterFrame = !!source[cursor++];
        var backgroundColor = source[cursor++] << 16 |
                              source[cursor++] <<  8 |
                              source[cursor++];
        var frameDataLength = source[cursor++] << 8 | source[cursor++];
        var frameData = [];

        for (var i = 0; i < frameDataLength; ++i) {
            var bytes = (source[cursor++] << 24 | source[cursor++] << 16 |
                         source[cursor++] <<  8 | source[cursor++]) >>> 0;

            frameData[i] = new APNGFrameData();
            frameData[i]["unpack"](source.subarray(cursor, cursor + bytes));
            cursor += bytes;
        }
        return {
            "apng": apng,
            "width": width,
            "height": height,
            "loopCount": loopCount,
            "usePosterFrame": usePosterFrame,
            "backgroundColor": backgroundColor,
            "frameData": frameData
        };
    }
    throw new TypeError("unsupported format");
}

// --- validate / assertions -------------------------------
//{@dev
function $valid(val, fn, hint) { if (global["Valid"]) { global["Valid"](val, fn, hint); } }
function $type(obj, type) { return global["Valid"] ? global["Valid"].type(obj, type) : true; }
//function $keys(obj, str) { return global["Valid"] ? global["Valid"].keys(obj, str) : true; }
//function $some(val, str, ignore) { return global["Valid"] ? global["Valid"].some(val, str, ignore) : true; }
//function $args(fn, args) { if (global["Valid"]) { global["Valid"].args(fn, args); } }
//}@dev

// --- exports ---------------------------------------------
if ("process" in global) {
    module["exports"] = BinaryPacker0x0003;
}
global["BinaryPacker0x0003" in global ? "BinaryPacker0x0003_" : "BinaryPacker0x0003"] = BinaryPacker0x0003; // switch module. http://git.io/Minify

})((this || 0).self || global); // WebModule idiom. http://git.io/WebModule


