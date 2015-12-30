layout: post
title: 使用React.js创建一个简单的时钟组件
date: 2015-12-30 14:24:26
tags: [React.js,javascript]
---
刚刚学习ReactJs不久, 对React中提到的一些概念比较喜欢，比如虚拟Dom，组件化等。

## Reactjs 简单介绍
它是facebook 开发的一个框架，现在facebook的 Instagram 网站就是用它来做的。 国内也有好些企业在用，比如teambition 的 简聊。
React 通常和其他的 JavaScript 框架同时被提及，比如很多时候大家使用React和angular相比。Angular是一个完整的框架（它包括一个 view 层, 有数据层，ajax功能，Promise等），但React 并没有,它仅仅是view层，也就是仅仅根据自身的某些状态不同来更新出不同的html结构。
React实现了单向响应的数据流，比传统数据绑定更加简单，也就和平常我们讨论的MVVM不一样，它仅仅是通过数据的变化来反应到view上面。
所谓组件，即封装起来的具有独立功能的UI部件，这是React比较推崇的。，将UI上每一个功能相对独立的模块定义成组件，然后将小的组件通过组合或者嵌套的方式构成大的组件，最终完成整体UI的构建。React为了更高超的性能，自己实现了一个虚拟DOM，而不是在第一时间直接改变真是DOM状态。

## 实现一个时钟组件
1.首先说一下功能，很简单，就是咱们平常看到的时钟一样，有时分秒三个指针, 指示当前系统的时间。像这样: ![时钟](/demo/react-clock/clock.png)

2.捋一捋思路:大概就是设置一个定时器,每隔一秒钟获取一下当前系统时间, 计算出对应的时分秒，然后使用得到的时分秒分别乘以对应的角度就得到了指针当前应该旋转在表盘的哪个角度了。通过设置指针的transform:rotate(xdeg)来实现旋转。
首先需要下载Reactjs 和 react-dom 到本地(我使用的版本是0.14.3), 为了方便，我直接把jsx代码写在了script标签中,这样就还需要引入一个解析jsx代码的插件叫JSXTransformer.js。当然还有一些js样式就不写出来了，文末有demo可以看到所有代码。
结构如下：

```html
    <body>
        <div class="container">
        </div>
        <script src="../node_modules/react/dist/react.js"></script>
        <script src="../node_modules/react-dom/dist/react-dom.js"></script>
        <script src="../vendor/JSXTransformer.js"></script>
        <script type="text/jsx">
            // code here
        </script>
    </body>
```

由于在代码中我们会多次用到获取系统时间,然后计算出时分秒，所以我把获取时间的功能抽离出来单独一个方法， 该方法返回一个对象包含了当前系统的时分秒信息。在设置初始state的时候我们使用了getNow方法来显示初始时间。

```javascript
    <!-- Clock组件 -->
     var Clock = React.createClass({
        getNow: function() {
            var now = new Date();
            return {
                hour: now.getHours(),
                min: now.getMinutes(),
                sec: now.getSeconds(),
            }
        },
        getInitialState: function() {
            var now = this.getNow();
            return {
                secAngle: now.sec * 6,
                minAngle: now.min * 6,
                hourAngle: now.hour * 30
            };
        },
        ...
        其他代码
        ...
    });

```

接下来就是动态的计算时间了，我们把这部分代码写在组件的componentDidMount 事件里，因为我们会用到setInterval, 了解过React应该知道这个事件在组件整个生命周期里面只会触发一次。一些异步操作(特别是与DOM相关)都应该写在这里面来。
```javascript
    this.setState({
        secAngle: now.sec * 6,
        minAngle: now.min * 6,
        hourAngle: now.hour * 30
    });
```

最终代码:
```javascript
     var Clock = React.createClass({
        getNow: function() {
            var now = new Date();
            return {
                hour: now.getHours(),
                min: now.getMinutes(),
                sec: now.getSeconds(),
            }
        },
        getInitialState: function() {
            var now = this.getNow();
            return {
                secAngle: now.sec * 6,
                minAngle: now.min * 6,
                hourAngle: now.hour * 30
            };
        },
        componentDidMount: function() {
            this._timer  = setInterval(function() {
                var now = this.getNow();
                this.setState({
                    secAngle: now.sec * 6,
                    minAngle: now.min * 6,
                    hourAngle: now.hour * 30
                });
            }.bind(this), 1000);
        },
        render: function() {
            return (
                <div className="clock-box">
                    <span className="sec-pointer" style={{transform: 'rotate(' + this.state.secAngle + 'deg)'}}></span>
                    <span className="hour-pointer" style={{transform: 'rotate(' + this.state.hourAngle + 'deg)'}}></span>
                    <span className="min-pointer" style={{transform: 'rotate(' + this.state.minAngle + 'deg)'}}></span>
                </div>
            );
        },
        componentWillUnmount: function() {
            clearInterval(this._timer);
        }
    });
    ReactDOM.render(
        <Clock/>,
        document.querySelector('.container')
    );
```


[完整demo](/demo/react-clock/)




