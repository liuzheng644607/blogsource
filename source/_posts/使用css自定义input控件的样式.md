layout: post
title: 使用css自定义input控件的样式
date: 2015-8-16 13:57:46
tags: CSS
---

>web开发中，input元素默认的样式比较丑，我们总想美化它。有的用图片来代替，搭配上css3、js等来实现各种切换效果等，反正是各有千秋。当然我们也可以直接使用css来自定义input元素的样式。最主要用到的就是-webkit-appearance:none这个属性设置，它可以重置标签默认样式。还有就是使用了::before，::after这样的伪元素来辅助一些效果。

### 0、基本的css 和 html结构 
这里只做了简单的几个input控件的测试, 一些样式参考了bootstrap的外观。

type="number" 的css

这个类型的input，我主要是需要自定义那个默认的向上向下箭头，它有::-webkit-inner-spin-button这个为元素,这便是箭头的默认元素啦~~~。 这是如何发现的? 在任意input框上使用chrome 审查元素就可以看到渲染的信息，前提是需要在chrome的settings->General里把 Elements 下面的**Show user agent shadow DOM**给勾选上。这里需要将他的appearance属性值设置为none,这样我们就看不见默认的箭头了，那么如何才能创建箭头呢？我使::before与::after来模拟，这两个伪元素 创建了两个三角形(关于如何使用元素画出三角形，请自行Google)。代码如下:
```css
    /*number*/
    input[type="number"]::-webkit-inner-spin-button{
        position: relative;
        width: 8px;
        transition:all .3s;
        -webkit-appearance: none;
    }
    input[type="number"]::-webkit-inner-spin-button::before,
    input[type="number"]::-webkit-inner-spin-button::after{
        content: "\0020";
        display: block;
        position: absolute;
        width: 0; 
        height: 0; 
        border-left: 4px solid transparent; 
        border-right: 4px solid transparent; 
    }
    input[type="number"]::-webkit-inner-spin-button::before{
        top: -1px;
        border-bottom: 8px solid #66afe9; 
    }
    input[type="number"]::-webkit-inner-spin-button::after{
        top: 50%;
        margin-top: 1px;
        border-top: 8px solid #66afe9; 
    }
```
[完整demo](/demo/input-appearance/)


没怎么写过博客...，全是废话. 就当记录吧..





