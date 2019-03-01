---
layout: post
title: mac命令行更改文件权限
date: 2018-08-23 18:02:55
tags: [mac, shell]
---


> 在开发一些系统应用的时候，有时候需要让用户输入电脑密码，然后我们拿到密码对系统进行操作。

```bash
echo  userpassword | sudo -S chmod 777 path-or-dir
```
我们先知道了密码，然后在进行系统操作。是个什么场景呢？比如开发了一款更改hosts文件的小工具，但是更改hosts文件需要用户电脑密码授权。我们可以给用户弹个输入框接收密码，然后拿到密码就可以做各种操作了。

平常更改hosts文件的流程是：先进行了修改，然后系统提示你输入密码。
```javascript
const child_process = require("child_process");
const prompt = require("prompt");

prompt.start();

var schema = {
  properties: {
    password: {
      description: "Enter your password",
      replace: "*",
      hidden: true
    }
  }
};

prompt.get(schema, (err, result) => {
  if (err) {
    throw err;
  }

  child_process.exec(`echo ${result.password} | sudo -S chmod 777 ./src/test.js`, (error, res) => {
    if (error) {
      throw error;
    }
    
  })
});

```
 更改过的文件权限信息如下

![image.png](https://upload-images.jianshu.io/upload_images/188895-4052a9df85929d40.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

