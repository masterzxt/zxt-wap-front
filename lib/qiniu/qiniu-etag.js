(function () {

    if (ArrayBuffer.prototype.hex) {
        return;
    }
    ArrayBuffer.prototype.hex = arrayBuf2Hex;


    window.qiniu = {
        sha1: sha1,
        etag: etag,
        base64ToUrlSafe: base64ToUrlSafe,
        blob2ArrayBuffer: blob2ArrayBuffer,
        etagToUrlSafeBase64: etagToUrlSafeBase64,
        mergeArrayBuffer: mergeArrayBuffer
    };


    function sha1(arrayBuffer) {
        return new Promise(function (resolve, reject) {
            var subtle = crypto ? (crypto.webkitSubtle) || crypto.subtle : null;
            if (!subtle) {
                reject(new Error("Web Cryptography API not supported, change browser please."));
            }

            subtle.digest({name: "SHA-1"}, arrayBuffer)
                .then(function (hash) {
                    resolve(hash);
                }, reject)
                .catch(reject);
        });
    }


    function etag(/*Blob*/blob, opts) {

        opts = opts ? opts : {};
        opts.chunkSize = opts.chunkSize ? opts.chunkSize : 4 * 1024 * 1024;

        var blobSlice = File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice;
        var chunks = Math.ceil(blob.size / opts.chunkSize);
        var prefix = new Uint8Array(1);
        prefix.set(chunks === 1 ? [0x16] : [0x96], 0);

        // $index = i, value = promise
        var chunksSha1PromiseArr = [];
        for (var i = 0; i < chunks; i++) {
            var curChunk = i;
            var start = curChunk * opts.chunkSize;
            var end = (start + opts.chunkSize) >= blob.size ? blob.size : start + opts.chunkSize;
            var chunk = blobSlice.call(blob, start, end);
            chunksSha1PromiseArr.push(blob2ArrayBuffer(chunk).then(sha1));
        }

        return Promise.all(chunksSha1PromiseArr)
            .then(function (hashs) {
                if (hashs.length === 1) {
                    return Promise.resolve(hashs[0]);
                }
                return mergeArrayBuffer(hashs)
                    .then(sha1);

            }).then(function (hash) {
                return mergeArrayBuffer([hash], prefix);
            });
    }


    function base64ToUrlSafe(base64Str) {
        return base64Str.replace(/\//g, '_').replace(/\+/g, '-');
    }

    function etagToUrlSafeBase64(arrayBuffer) {
        return base64ToUrlSafe(StringView.bytesToBase64(new Uint8Array(arrayBuffer)))
    }

    /* function(ArrayBuffer hash) */
    /* optional function(Error e) */
    function blob2ArrayBuffer(/*{Blob}*/ _blob) {
        return new Promise(function (resolve, reject) {
            var fileReader = new FileReader();
            fileReader.addEventListener("error", function (e) {
                var err = new Error("FileReader error");
                err.event = e;
                reject(err);
            });
            fileReader.onload = function (e) {
                resolve(e.target.result);
                //sha1(e.target.result).then(resolve, reject).catch(reject);
                // subtle.digest({name: "SHA-1"}, e.target.result) // {name: "SHA-1"}
                //     .then(function (hash) {
                //         resolve(sha1(hash));
                //     }, reject)
                //     .catch(reject);
            };
            fileReader.readAsArrayBuffer(_blob);
        });
    }


    /**
     * return promise. 它resolve 追加前缀后,合并了的多个hash的 ArrayBuffer。
     * @param arrayBuffers
     * @returns {Promise}
     */
    function mergeArrayBuffer(arrayBuffers, prefix) {

        var combinedData = [];
        if (prefix) {
            combinedData.push(prefix);
        }
        Array.prototype.push.apply(combinedData, arrayBuffers);

        var blob = new Blob(combinedData);

        return blob2ArrayBuffer(blob);
    }


    // 将 ArrayBuffer 变更为 Hex 字符串(小写)
    // 参考: https://developer.mozilla.org/en-US/docs/Web/API/SubtleCrypto/digest
    // 使用: console.log(Int8Array.from([1,2,3,4,5]).buffer.hex()); // "0102030405"
    function arrayBuf2Hex() {
        var hexCodes = [];
        var view = new DataView(this);
        for (var i = 0; i < view.byteLength; i++) {
            // Using getUint32 reduces the number of iterations needed (we process 1 bytes each time)
            var value = view.getUint8(i);
            // toString(16) will give the hex representation of the number without padding
            var stringValue = value.toString(16);
            // We use concatenation and slice for padding
            var padding = '00';
            var paddedValue = (padding + stringValue).slice(-padding.length);
            hexCodes.push(paddedValue);
        }

        // Join all the hex strings into one
        return hexCodes.join("");
    }

})();