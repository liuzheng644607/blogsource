(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        define(factory);
    } else if (typeof exports === 'object') {
        module.exports = factory();
    } else {
        root.PreviewImage = factory(root.Zepto || root.jQuery);
    }
}(this, function($) {
    var vendors = ['Moz', 'Webkit', 'O'],
        testEl = document.createElement('div'),
        cssPrefix = '',
        jsPrefix = '';

    // 支持检测
    vendors.some(function(vendor) {
        if (testEl.style[vendor.toLowerCase() + 'TransitionProperty'] !== undefined) {
            cssPrefix = '-' + vendor.toLowerCase() + '-';
            jsPrefix = vendor.toLowerCase();
            return false;
        }
    });

    var transition = jsPrefix === '' ? 'transition' : jsPrefix + 'Transition';
    var transform = jsPrefix === '' ? 'transform' : jsPrefix + 'Transform';
    // 一个小图
    var opacityGif = 'data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVQImWNgYGBgAAAABQABh6FO1AAAAABJRU5ErkJggg==';

    function PreviewImage(option) {
        var defaultOption = {
            current: 0,
            container: null,
            images: [],
            showCountBar: true
        };

        this.option = option = $.extend(true, defaultOption, option);

        this.duration = ~~option.duration;
        this.container = option.container;
        this.images = option.images;

        var _cur = ~~option.current;
        this.current = _cur > this.images.length ? this.images.length - 1 : _cur < 0 ? 0 : _cur;

        this.showCountBar = !!option.showCountBar;
        this.init();
        this.render();
        this.bindEvents();
    }

    PreviewImage.prototype = {
        constructor: PreviewImage,
        init: function() {
            this.rect = this.container.getBoundingClientRect();
            // this.radio = this.rect.height / this.rect.width;
            this.scaleW = this.rect.width;
            this.idx = this.current;
            this.container.classList.add('preview-image-container');
        },
        render: function() {
            var container = this.container;
            var images = this.images;
            var len = images.length;

            this.countBar = document.createElement('p');
            this.countBar.innerHTML = '<span>' + (this.idx + 1) + '/' + len + '</span>';
            this.countBar.className = 'countBar';
            if (this.showCountBar) {
                container.appendChild(this.countBar);
            }
            this.listBox = document.createElement('ul');
            for (var i = 0; i < len; i++) {
                var li = document.createElement('li');
                var item = images[i];
                li.style.width = this.scaleW + 'px';
                li.style[transform] = 'translate3d(' + (i - this.idx) * this.scaleW + 'px, 0, 0)';
                li.style[transition] = cssPrefix + 'transform ' + this.duration + 'ms ease-out';
                if (i == this.idx) {
                    li.innerHTML = '<img src="' + item['src'] + '">';
                } else {
                    li.innerHTML = '<img src="' + (this.option.thumb || this.option.loading || opacityGif) + '">';
                }
                this.listBox.appendChild(li);
            }
            this.listBox.style.cssText = 'width:' + this.scaleW + 'px';
            container.appendChild(this.listBox);

            if (typeof this.option.ready === 'function') {
                this.option.ready(this, this.idx);
            }
        },

        prev: function() {
            this.goIndex('+1');
        },
        next: function() {
            this.goIndex('-1');
        },
        // 直接切换到指定页码
        goIndex: function(n) {
            var idx = this.idx;
            var lis = this.listBox.getElementsByTagName('li');
            var len = lis.length;
            var cidx;
            if (typeof n === 'number') {
                cidx = n;
            } else if (typeof n === 'string') {
                cidx = idx + n * 1;
            }
            if (cidx > len - 1) {
                cidx = len - 1;
            } else if (cidx < 0) {
                cidx = 0;
            }

            //保留当前索引值
            this.idx = cidx;

            var curImg = lis[cidx].getElementsByTagName('img')[0];

            [].forEach.call(lis, function(li, index) {
                li.style[transform] = 'translate3d(' + (index - cidx) * this.scaleW + 'px, 0, 0)';
                li.style[transition] = cssPrefix + 'transform ' + this.duration + 'ms ease-out';
            }.bind(this));

            loadImg(curImg, this.images[cidx].src);

            this.countBar.innerHTML = '<span>' + (this.idx + 1) + '/' + lis.length + '</span>';
            if (typeof this.option.after === 'function') {
                this.option.after(this, this.idx);
            }
        },
        bindEvents: function() {
            var self = this;
            var scaleW = self.scaleW;
            var outer = self.listBox;
            var len = self.images.length;

            //手指按下的处理事件
            var startHandler = function(evt) {

                //记录刚刚开始按下的时间
                self.startTime = new Date() * 1;

                //记录手指按下的坐标
                self.startX = evt.targetTouches && evt.targetTouches[0].pageX || evt.pageX;
                self._mouseDown = true;

                //清除偏移量
                self.offsetX = 0;

                //事件对象
                var target = evt.target;
                while (target.nodeName != 'LI' && target.nodeName != 'BODY') {
                    target = target.parentNode;
                }
                self.target = target;

            };

            //手指移动的处理事件
            var moveHandler = function(evt) {
                evt.preventDefault();
                if (!self._mouseDown) return;
                //计算手指的偏移量
                self.offsetX = (evt.targetTouches && evt.targetTouches[0].pageX || evt.pageX) - self.startX;

                var lis = outer.getElementsByTagName('li');
                //起始索引
                var i = self.idx - 1;
                //结束索引
                var m = i + 3;
                for (i; i < m; i++) {
                    lis[i] && (lis[i].style[transition] = cssPrefix + 'transform 0s ease-out');
                    lis[i] && (lis[i].style[transform] = 'translate3d(' + ((i - self.idx) * self.scaleW + self.offsetX) + 'px, 0, 0)');
                }
            };

            //手指抬起的处理事件
            var endHandler = function(evt) {
                evt.preventDefault();
                self._mouseDown = false;

                var boundary = scaleW / 6;

                //手指抬起的时间值
                var endTime = new Date() * 1;

                //所有列表项
                var lis = outer.getElementsByTagName('li');

                //当手指移动时间超过300ms 的时候，按位移算
                if (endTime - self.startTime > 300) {
                    if (self.offsetX >= boundary) {
                        self.goIndex('-1');
                    } else if (self.offsetX < 0 && self.offsetX < -boundary) {
                        self.goIndex('+1');
                    } else {
                        self.goIndex('0');
                    }
                } else {
                    //优化
                    //快速移动也能使得翻页
                    if (self.offsetX > 50) {
                        self.goIndex('-1');
                    } else if (self.offsetX < -50) {
                        self.goIndex('+1');
                    } else {
                        self.goIndex('0');
                    }
                }
            };

            //绑定touch事件
            outer.addEventListener('touchstart', startHandler);
            outer.addEventListener('touchmove', moveHandler);
            outer.addEventListener('touchend', endHandler);

            //绑定mouse事件
            outer.addEventListener('mousedown', startHandler);
            outer.addEventListener('mousemove', moveHandler);
            outer.addEventListener('mouseup', endHandler);
        }
    };

    /*------tools------*/
    /**
     * 加载图片
     */
    function loadImg(img, src) {
        if (Object.prototype.toString.call(img) !== '[object HTMLImageElement]') {
            return;
        }
        var temImg = new Image();
        temImg.src = src;
        temImg.onload = function() {
            img.src = src;
            temImg = null;
        };
        return img;
    }
    /*------tools end------*/

    // 暴露给浏览器
    return PreviewImage;
}));