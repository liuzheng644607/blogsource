---
layout: post
title: react-native制作新手引导组件
date: 2017-02-26 16:21:20
tags: ['react-native']
categories: ['react-native']
---

最近学习了一下react-native zIndex 属属性的用法，在没有用它之前一直觉得这没啥嘛，以为就和css里面的z-index一样的, 用了才知道他们不尽相同，因为我最初想通过它来实现引导效果的。

现在完成的效果长这样：(请将就一下丑陋的demo页面...😊)

<!-- more -->

IOS:
![引导组件](http://upload-images.jianshu.io/upload_images/188895-d85fe338dd7855a4.gif?imageMogr2/auto-orient/strip)
Android:
![2月-27-2017 20-00-05.gif](http://upload-images.jianshu.io/upload_images/188895-242894bc2943ea04.gif?imageMogr2/auto-orient/strip)

使用方法
```javascript
/**
goup 代表分组，如果只有一类引导的话，可以不用管它。
step 标示第几个提示
content 是提示内容
**/
import Intro, { intro } from 'react-native-intro';
<Intro 
      content="这是引导提示"
      group="test1"
      step={1}>
    // 其他组件
</Intro>

// 启动演示
var myIntro = intro({group: 'yourGroup'});
myIntro.start();

```
但是还不支持 被Redux connect 包裹的组件....
[代码放在 github](https://github.com/liuzheng644607/react-native-intro)