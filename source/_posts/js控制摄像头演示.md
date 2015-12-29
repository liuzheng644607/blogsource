layout: post
title: js控制摄像头演示
date: 2015-12-23 12:00:27
tags: html5
---
### html 结构
``` html
<div class="container">
    <div class="video-box fl">
        <video id="webcam"></video>
        <canvas width="600" height="450" id="canvas"></canvas>
    </div>
    <div class="photo-box fl">
        <img id="photo" src="blob:" alt="">
    </div>
</div>
<div class="control-bar">
    <button id="take-a-picture">拍照</button>
</div>
```


### js 代码
```javascript
    var vendors = ['Webkit', 'Moz', 'O'];
    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia ||
        navigator.mozGetUserMedia;

    var video = document.getElementById('webcam');
    var photo = document.getElementById('photo');
    var btnTakePicture = document.getElementById('take-a-picture');
    var canvas = document.getElementById('canvas'),
        ctx = canvas.getContext('2d'),
        mediaStream;
    // 调用
    getWebcam();
    btnTakePicture.addEventListener('click', snapshot, false);
    // 获取摄像头
    function getWebcam() {
        if (navigator.getUserMedia) {
            navigator.getUserMedia({
                video: true
            }, getMediaSuccess, getMediaError);
        } else {
            alert('你的浏览器不支持 navigator.getUserMedia');
        }
    }
    // 获取成功
    function getMediaSuccess(e) {
        window.URL = window.URL || window.webkitURL || window.mozURL;
        if (window.URL) {
            video.src = window.URL.createObjectURL(e);
        } else {
            video.src = e;
        }
        // 保存
        mediaStream = e;
        video.autoplay = true;
    }

    // 获取失败
    function getMediaError(e) {
        console.error(e);
    }

    // 拍照
    function snapshot() {
        if (mediaStream) {
            ctx.drawImage(video, 0, 0);
            photo.src = canvas.toDataURL('image/png');
        }
    }
```

[完整demo](/demo/webRTC/)
chrome可能不能使用此功能，出现如下警告。换个浏览器试试呢, firefox
> getUserMedia() no longer works on insecure origins. To use this feature, you should consider switching your application to a secure origin, such as HTTPS. See https://goo.gl/rStTGz for more details.


