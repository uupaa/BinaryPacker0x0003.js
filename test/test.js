var ModuleTestBinaryPacker0x0003 = (function(global) {

var _runOnNode = "process" in global;
var _runOnWorker = "WorkerLocation" in global;
var _runOnBrowser = "document" in global;

return new Test("BinaryPacker0x0003", {
        disable:    false,
        browser:    true,
        worker:     true,
        node:       true,
        button:     true,
        both:       true, // test the primary module and secondary module
    }).add([
        testBinaryPacker0x0003,
    ]).run().clone();

function testBinaryPacker0x0003(test, pass, miss) {

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
            "_token": 123,
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

    if (source._token === result._token &&
        source.apng === result.apng &&
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

        test.done(pass());
        return;
    }
    test.done(miss());
}

})((this || 0).self || global);


