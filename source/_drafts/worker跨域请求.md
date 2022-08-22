---
layout: post
title: web worker跨域请求
date: 2022-05-06 11:10:45
tags: web worker
---

# 什么是 Web Worker
引用MDN中关于Web Worker的一段描述
> Web Worker为Web内容在后台线程中运行脚本提供了一种简单的方法。线程可以执行任务而不干扰用户界面。此外，他们可以使用XMLHttpRequest执行 I/O  (尽管responseXML和channel属性总是为空)。一旦创建， 一个worker 可以将消息发送到创建它的JavaScript代码, 通过将消息发布到该代码指定的事件处理程序（反之亦然）

## Web Worker 分类

web worker主要分为 **专用worker** 和 **共享worker**
- 专用worker
    - 一个专用worker仅仅能被生成它的脚本所使用
- 共享worker
    - 一个共享worker可以被多个脚本使用——即使这些脚本正在被不同的window、iframe或者worker访问。

## worker示例

```javascript
const workerUrl = 'your/worker/url.js';
var myWorker = new Worker(workerUrl);
```


