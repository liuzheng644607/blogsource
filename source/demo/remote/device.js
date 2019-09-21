const Device = (function() {
  const isElectron = window.process && window.process.type === "renderer";
  let desktopCapturer;
  if (isElectron) {
    let electron = require("electron");
    desktopCapturer = electron.desktopCapturer;
  }

  function getBrowserScreen() {
    return new Promise((resolve, reject) => {
      if (navigator.mediaDevices && navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia().then(stream => {
          resolve(stream);
        });
      } else {
        reject(new Error("您的浏览器不支持分享屏幕"));
      }
    });
  }

  function getElectronScreen() {
    return new Promise((resolve, reject) => {
      desktopCapturer.getSources(
        { types: ["window", "screen"] },
        (err, sources) => {
          if (err) {
            reject(err);
            return;
          }
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
            stream => {
              resolve(stream);
            },
            reject
          );
        }
      );
    });
  }

  function getUserMedia(opt) {
    return new Promise((resolve, reject) => {
      var getUserMedia =
        window.navigator.getUserMedia ||
        window.navigator.webkitGetUserMedia ||
        window.navigator.mozGetUserMedia ||
        window.navigator.msGetUserMedia;
      if (!getUserMedia) {
        return reject(new Error("您的浏览器不支持getUserMedia"));
      }
      getUserMedia.bind(navigator)(
        opt,
        stream => {
          resolve(stream);
        },
        reject
      );
    });
  }

  return {
    getScreenStream: () => {
      return isElectron ? getElectronScreen() : getBrowserScreen();
    },
    getUserMedia: getUserMedia
  };
})();
