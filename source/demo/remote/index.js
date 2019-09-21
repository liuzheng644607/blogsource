(function() {
  const localPeerKey = "localPeerKey";
  const peerIdEl = document.getElementById("js-peer-id");
  const inputEl = document.getElementById("js-input-id");
  const btnConnEl = document.getElementById("js-btn-connect");
  const btnVideoConnEL = document.getElementById("js-btn-video");
  const jsRemoteVideoEl = document.getElementById("js-remote-video");
  const jsSelfVideoEl = document.getElementById("js-self-video");
  const jsSharedScreenTips = document.getElementById('js-shared-screen-tips');
  const jsViewSharedScreenBtn = document.getElementById('js-view-shared-screen');

  const CALL_TYPE = {
    video: "VIDEO",
    shareScreen: "share-screen"
  };
  const sharedScreenMap = {};
  let lastPeerId = localStorage.getItem(localPeerKey);
  let newWindow = null;

  function closeWindow() {
    newWindow && newWindow.close();
    newWindow = null;
  }

  const peer = new Peer(lastPeerId, {
    // host: "peer.lyan.me",
    // secure: false,
    // port: 9000,
    debug: 3
  });

  peer.on("open", id => {
    lastPeerId = id;
    localStorage.setItem(localPeerKey, id);
    peerIdEl.innerText = id;
  });

  peer.on("call", mediaConnection => {
    const type = mediaConnection.metadata.type;
    switch (type) {
      case CALL_TYPE.shareScreen:
        receiveScreen(mediaConnection);
        break;
      case CALL_TYPE.video:
        if (confirm(`${mediaConnection.peer}想与您视频通话`)) {
          shareVideo(mediaConnection);
        }
        break;
    }
  });

  peer.on("disconnected", e => {
    console.log("已断开连接", e);
  });

  peer.on("error", e => {
    const message = e.message;
    if (/is taken/.test(message)) {
      localStorage.setItem(localPeerKey, "");
      window.location.reload();
    } else {
      alert(e);
    }
    closeWindow();
  });

  btnConnEl.addEventListener("click", () => {
    const remoteId = getRemoteId();
    shareSelfScreen(remoteId);
  });

  btnVideoConnEL.addEventListener("click", () => {
    const remoteId = getRemoteId();
    videoConnect(remoteId);
  });

  jsViewSharedScreenBtn.addEventListener('click', function(e) {
    const peerId = e.target.dataset.peerId;
    createScreenWindow(peerId);
  })

  /**
   * 视频通话请求
   * @param {*} peerId 
   */
  function videoConnect(peerId) {
    Device.getUserMedia({ video: true, audio: true }).then(stream => {
      var call = peer.call(peerId, stream, {
        metadata: {
          type: CALL_TYPE.video
        }
      });
      call.on("stream", function(remoteStream) {
        renderRemoteVideo(createVideo(remoteStream));
      });
      renderSelfVideo(createVideo(stream));
    });
  }

  /**
   * 分享自己的屏幕
   */
  function shareSelfScreen(peerId) {
    Device.getScreenStream().then((stream) => {
      const mediaConnection = peer.call(peerId, stream, {
        metadata: {
          type: CALL_TYPE.shareScreen
        }
      });
      //  取消分享，断开连接
      stream.oninactive = () => {
        mediaConnection.close();
      }
    });
  }

  function receiveScreen(mediaConnection) {
    const peerId = mediaConnection.peer;
    if (sharedScreenMap[peerId]) {
      createScreenWindow(peerId);
      return;
    }
    const canvas = document.createElement("canvas");
    const stream = canvas.captureStream(~~(Math.random() * 100));
    mediaConnection.answer(stream);
    mediaConnection.on("stream", remoteStream => {
      sharedScreenMap[peerId] = remoteStream;
      showScreenTips(peerId);
    });

    mediaConnection.on("close", e => {
      sharedScreenMap[peerId] = null;
      hideScreenTips();
      closeWindow();
    });

    mediaConnection.on("error", e => {
      sharedScreenMap[peerId] = null;
      hideScreenTips();
      closeWindow();
    });
  }

  function getRemoteId() {
    const remoteId = inputEl.value;
    if (!remoteId || lastPeerId === remoteId) {
      alert("请输入识别码");
      throw new Error("请输入识别码");
    }

    return remoteId;
  }

  function createVideo(stream) {
    const videoEl = document.createElement("video");
    videoEl.srcObject = stream;
    videoEl.autoplay = true;
    return videoEl;
  }

  function shareVideo(mediaConnection) {
    Device.getUserMedia({ video: true, audio: true }).then(stream => {
      mediaConnection.answer(stream);
      mediaConnection.on("stream", function(remoteStream) {
        renderRemoteVideo(createVideo(remoteStream));
      });
      renderSelfVideo(createVideo(stream));
    });
  }

  function renderSelfVideo(video) {
    jsSelfVideoEl.innerHTML = "";
    jsSelfVideoEl.appendChild(video);
  }

  function renderRemoteVideo(video) {
    jsRemoteVideoEl.innerHTML = "";
    jsRemoteVideoEl.appendChild(video);
  }

  function showScreenTips(peerId) {
    jsSharedScreenTips.style.display = '';
    jsViewSharedScreenBtn.dataset.peerId = peerId;
  }

  function hideScreenTips() {
    jsSharedScreenTips.style.display = 'none';
  }

  function createScreenWindow(peerId) {
    const remoteStream = sharedScreenMap[peerId];
    if (!remoteStream) {
      alert("没有人分享屏幕");
      return;
    }
    if (newWindow) {
      newWindow.close();
    }
    newWindow = window.open(
      'screen.html',
      "",
      "toobar=no,menubar=no,scrollbars=no,location=no,status=no"
    );
    if (newWindow) {
      newWindow.onclose = () => {
        newWindow = null;
        mediaConnection.close();
      };
      newWindow.onload = () => {
        if (newWindow) {
          newWindow.document.body.innerHTML = "";
          newWindow.document.body.appendChild(createVideo(remoteStream));
        }
      };
    }
  }
})();
