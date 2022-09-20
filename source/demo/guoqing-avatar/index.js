void (function () {
  var win = window;
  var doc = document;

  class App {
    currentSelectedImageSrc = './images/img2.png';

    currentAvatarSrc = './images/s/default.png';

    canvasContext = null;
  
    constructor() {
      this.init();
    }

    init() {
      this.initImageSource();
      this.bindImageSourceEvent();
      this.initCanvas();
      this.drawImage()
    }

    initImageSource() {
      var footer = doc.querySelector(".footer .inner");
      var count = 26;
      var htmlStr = "";
      var curIndex = 1;
      while (curIndex <= count) {
        var src = "./images/img" + curIndex + ".png";
        htmlStr +=
          '<div class="img-item" data-img="' +
          src +
          '"><img src="' +
          src +
          '"></img></div>';
        curIndex++;
      }
      footer.innerHTML = htmlStr;
    }

    bindImageSourceEvent() {
      var self = this;
      $(".footer .img-item").on("click", function (e) {
        const imgItem = $(this);
        $(".footer .img-item").removeClass("selected");
        imgItem.addClass("selected");
    
        $(".avatar-post").attr("src", imgItem.data().img);

        self.currentSelectedImageSrc = imgItem.data().img;

        self.drawImage();
      });

      $('#js-pick-image').on('change', function(e, f) {
        const file = this.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          self.currentAvatarSrc = reader.result;
          $(".avatar-origin").attr("src", reader.result);
          self.drawImage();
        }
      });

      $('.btn-save').on('click', () => {
        this.download();
      })
    }

    initCanvas() {
      const canvas = doc.querySelector('#canvas');
      const ctx = canvas.getContext('2d');
      this.canvasContext = ctx;
    }

    drawImage() {
      const ctx = this.canvasContext;
      const { width, height } = ctx.canvas;
      const avatarSource = new Image(width, height);
      const postSource = new Image(width, height);
      postSource.src = this.currentSelectedImageSrc;
      avatarSource.src = this.currentAvatarSrc;
      const p1 = new Promise((resolve) => {
        postSource.onload = () => {
          resolve(postSource);
        }
      });
      const p2 = new Promise((resolve) => {
        avatarSource.onload = () => {
          resolve(avatarSource);
        }
      });
      
      Promise.all([p1, p2]).then(([p1, p2]) => {
        ctx.clearRect(0, 0, width, height);
        ctx.drawImage(p2, 0, 0, p2.width, p2.height);
        ctx.drawImage(p1, 0, 0, p1.width, p1.height);
      });
    }

    download() {
      const link = document.createElement('a');
      link.href = this.canvasContext.canvas.toDataURL();
      link.download = Date.now() + '_avatar.png';
      link.click();
    }
  }

  new App();
})();
