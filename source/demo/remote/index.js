let desktopCapturer;
if (isInElectron()) {
  let electron = require("electron");
  desktopCapturer = electron.desktopCapturer;
}

const localPeerKey = "localPeerKey";
const peerIdEl = document.getElementById("js-peer-id");
const inputEl = document.getElementById("js-input-id");
const btnConnEl = document.getElementById("js-btn-connect");
const btnVideoConnEL = document.getElementById("js-btn-video");
const jsRemoteVideoEl = document.getElementById("js-remote-video");
const jsSelfVideoEl = document.getElementById("js-self-video");
const CALL_TYPE = {
  video: "VIDEO",
  shareScreen: "share-screen"
};

var getUserMedia = (function() {
  var getUserMedia =
    window.navigator.getUserMedia ||
    window.navigator.webkitGetUserMedia ||
    window.navigator.mozGetUserMedia ||
    window.navigator.msGetUserMedia;
  if (!getUserMedia) {
    throw new Error("您的浏览器不支持getUserMedia");
  }
  return getUserMedia.bind(navigator);
})();

let lastPeerId = localStorage.getItem(localPeerKey);
let newWindow = null;

function closeWindow() {
  newWindow && newWindow.close();
  newWindow = null;
}

const peer = new Peer(lastPeerId, {
  host: "peer.lyan.me",
  port: 9000,
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
      shareScreen(mediaConnection);
      break;
    case CALL_TYPE.video:
      shareVideo(mediaConnection);
      break;
  }
});

peer.on("disconnected", e => {
  console.log("已断开连接", e);
});

peer.on("error", e => {
  alert(e);
  closeWindow();
});

btnConnEl.addEventListener("click", () => {
  const remoteId = getRemoteId();
  callRemote(remoteId);
});

btnVideoConnEL.addEventListener("click", () => {
  const remoteId = getRemoteId();
  videoConnect(remoteId);
});

function videoConnect(peerId) {
  getUserMedia(
    { video: true, audio: true },
    stream => {
      var call = peer.call(peerId, stream, {
        metadata: {
          type: CALL_TYPE.video
        }
      });
      call.on("stream", function(remoteStream) {
        renderRemoteVideo(createVideo(remoteStream));
      });
      renderSelfVideo(createVideo(stream));
    },
    err => {
      console.log("Failed to get local stream", err);
    }
  );
}

function callRemote(peerId) {
  const canvas = document.createElement("canvas");
  const stream = canvas.captureStream(1);
  const mediaConnection = peer.call(peerId, stream, {
    metadata: {
      type: CALL_TYPE.shareScreen
    }
  });
  mediaConnection.on("stream", remoteStream => {
    newWindow = window.open(
      peerId,
      "",
      "toobar=no,menubar=no,scrollbars=no,location=no,status=no"
    );
    setTimeout(() => {
      if (newWindow) {
        newWindow.document.body.innerHTML = "";
        newWindow.document.body.appendChild(createVideo(remoteStream));
      }
    }, 1500);

    newWindow.onclose = () => {
      mediaConnection.close();
    };
  });

  mediaConnection.on("close", e => {
    closeWindow();
  });

  mediaConnection.on("error", e => {
    closeWindow();
    alert(e);
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

function shareScreen(mediaConnection) {
  if (isInElectron()) {
    shareElectronScreen(mediaConnection);
  } else {
    shareBrowserScreen(mediaConnection);
  }
}

function shareBrowserScreen(mediaConnection) {
  navigator.mediaDevices.getDisplayMedia().then(stream => {
    mediaConnection.answer(stream);
  });
}

function shareElectronScreen(mediaConnection) {
  desktopCapturer.getSources(
    { types: ["window", "screen"] },
    (err, sources) => {
      const selectedSource = sources[0];
      constraints = {
        audio: false,
        video: {
          mandatory: {
            chromeMediaSource: "desktop",
            chromeMediaSourceId: selectedSource.id,
            maxWidth: screen.availWidth,
            maxHeight: screen.availHeight,
            maxFrameRate: 100,
            minFrameRate: 60
          }
        }
      };
      navigator.getUserMedia(
        constraints,
        steam => {
          mediaConnection.answer(steam);
        },
        handleErr
      );
    }
  );
}

function shareVideo(mediaConnection) {
  getUserMedia(
    { video: true, audio: true },
    function(stream) {
      mediaConnection.answer(stream);
      mediaConnection.on("stream", function(remoteStream) {
        renderRemoteVideo(createVideo(remoteStream));
      });
      renderSelfVideo(createVideo(stream));
    },
    function(err) {
      console.log("Failed to get local stream", err);
    }
  );
}

function renderSelfVideo(video) {
  jsSelfVideoEl.innerHTML = "";
  jsSelfVideoEl.appendChild(video);
}

function renderRemoteVideo(video) {
  jsRemoteVideoEl.innerHTML = "";
  jsRemoteVideoEl.appendChild(video);
}

function isInElectron() {
  return window.process && window.process.type === "renderer";
}

function handleErr(err) {
  console.log(err);
}

