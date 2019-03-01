---
layout: post
title: 微信小程序IDE上传/预览代码分析
date: 2019-01-13 18:45:37
tags: [小程序]
---

>接口分析见：[小程序IDE http接口分析](https://www.jianshu.com/p/a1f357152dca "小程序IDE http接口分析")

## 打包源代码
主要步骤就是，遍历小程序项目目录，读取每一个文件，最终合并成一个文件
内容如下：packFile.js

```
const a = require("glob"),
b = require("fs"),
c = require("path"),
e = require("crypto");
module.exports = async (f, g, h = {}) => {
var i = [
  new Buffer(1),
  new Buffer(4),
  new Buffer(4),
  new Buffer(4),
  new Buffer(1)
];
i[0].writeIntLE(190), i[1].writeInt32BE(1), i[4].writeIntLE(237);
let j = 0,
  k = [],
  l = [],
  m = [],
  n = [],
  o = [];
return new Promise((p, q) => {
  let r = Object.assign({ nodir: !0 }, h),
    s = {};
  a(`${f}/**`, r, (a, r) => {
    if (!a) {
      r.forEach(a => {
        let d = b.readFileSync(a),
          g = c.relative(f, a);
        if (h.needMd5) {
          let a = e.createHash("md5");
          a.update(d);
          let b = a.digest("hex");
          if (((s[g] = b), h.ignoreFileMd5 && h.ignoreFileMd5[g] == b))
            return;
        }
        let i = new Buffer(`/${g.replace(/\\/g, "/")}`);
        j++, m.push(i), n.push(d);
      });
      let a = 18 + 12 * j + Buffer.concat(m).length;
      l = m.map((b, c) => {
        let d = new Buffer(4);
        d.writeInt32BE(b.length);
        let e = new Buffer(4),
          f = n[c].length,
          g = a;
        e.writeInt32BE(g), (a += f);
        let h = new Buffer(4);
        return h.writeInt32BE(f), Buffer.concat([d, b, e, h]);
      });
      let q = new Buffer(4);
      q.writeInt32BE(j),
        l.unshift(q),
        (k = Buffer.concat(l)),
        (o = Buffer.concat(n)),
        i[2].writeInt32BE(k.length),
        i[3].writeInt32BE(o.length),
        (i = Buffer.concat(i));
      let t = Buffer.concat([i, k, o]);
      b.writeFileSync(g, t),
        p({ destPath: g, data: t, fileMd5Info: s });
    } else q(a);
  });
});
};
```
## 上传预览
使用packFile.js打包源代码，将结果拿到，然后进行gz压缩，调用request模块进行上传.
upload.js 如下
```
const zlib = require("zlib");
const request = require("request");
const readFile = require('./packFile');

var url = 'https://servicewechat.com/wxa-dev-new/testsource?_r=0.8285819896175328&appid=xxx&platform=0&ext_appid=&os=darwin&clientversion=1011711020&gzip=1&path=pages%2Fhome%3F&newticket=_GWuaDA19IaLERB2pjnjJGaI61JHOfXnA8N6dDoJT20&os=darwin&clientversion=1.01.1711020';
var f = readFile('dist/', './1.wx').then((res) => {
    var data = zlib.gzipSync(res.data);
    request({ url, body: data, method: 'post',"proxy":"http://127.0.0.1:8888","tunnel":false }, (a, b, c) => {
        console.log(JSON.stringify(c));
    });
});
```
运行 `sudo node ./upload.js`;
则会生成`1.wx`文件，拿到这个文件上传就行了～