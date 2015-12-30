importScripts('pako.min.js');

onmessage = function(e) {
    var data = e.data.data;
    var action = e.data.compressType;
    if (Object.prototype.toString.call(data) === '[object File]') {
        var reader = new FileReader();
        reader.readAsBinaryString(data);
        reader.onload = function(e) {
            var binaryString = pako[action](e.target.result);
            console.log(Object.prototype.toString.call(binaryString));
            postMessage(binaryString);
        };
    } else {
        var binaryString = pako[action](data, {
            // level: 5
        });
        postMessage(binaryString);
    }
};
