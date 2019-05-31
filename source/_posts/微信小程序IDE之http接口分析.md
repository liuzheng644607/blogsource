---
layout: post
title: 微信小程序IDE之http接口分析
date: 2019-01-10 18:33:34
tags: [小程序上传, 小程序]
---

>在2017年的时候就做了这个分析，一直没发出来。⚠️注意文中使用的ide版本是Mac 版的，ide version: 1.01.1711020，不推荐在生产环境中使用。
# 准备工作
下载IDE版本：1.01.1711020
- 美化开发工具js代码：在js目录执行命令 `find . -type f -name '*.js' -exec js-beautify -r -s 2 -p -f '{}' \`;

- 打开针对IDE的调试工具：在./app.nw/js/core/index.js 第81行 init() 过后 加入以下代码：`nw.Window.get().showDevTools()`;

- 在IDE源码中使用 `global.contentWindow.console.log` 来打印变量
<!-- more -->

# 微信开发者工具登陆接口
[URL配置文件](https://gist.github.com/liuzheng644607/9ae29c8516aac8c94d893cfca2a4c7b9)
全局搜索 ***LOGIN_URL***
登录页面的固定url:
[https://open.weixin.qq.com/connect/qrconnect?appid=xxx&redirect_uri=https%3a%2f%2fmp.weixin.qq.com%2fdebug%2fcgi-bin%2fwebdebugger%2fqrcode&scope=snsapi_login&state=login](https://open.weixin.qq.com/connect/qrconnect?appid=xxx&redirect_uri=https%3a%2f%2fmp.weixin.qq.com%2fdebug%2fcgi-bin%2fwebdebugger%2fqrcode&scope=snsapi_login&state=login "https://open.weixin.qq.com/connect/qrconnect?appid=wxde40e023744664cb&redirect_uri=https%3a%2f%2fmp.weixin.qq.com%2fdebug%2fcgi-bin%2fwebdebugger%2fqrcode&scope=snsapi_login&state=login")
他返回二维码扫码页面（html）。
此处代码可以全局搜索 `_longPollURL` 定位到该文件。
**在集成到发布系统的时候，完全可以用headless chrome 或者是 phantom js 模拟请求来一步搞定。**
# ide中登陆流程如下
```javascript
// step1: 拿到二维码链接
const content = ''; // 上面接口返回的html
const qrcodeReg = /src="\/(connect\/qrcode\/.+)"/;
const s = c.match(qrcodeReg)[1];
const src = `https://open.weixin.qq.com/${s}`; // 拼接出登陆二维码url
 
// step2 : 拿到轮询链接, 用于轮询登陆状态
const longPollReg = /"(https:\/\/long.open.weixin.qq.com\/connect\/l\/qrconnect\?uuid=.+?)"/;
const pollUrl = content.match(longPollReg)[1];
 
// step3 轮询登陆结果
const LOGIN_WX_ERRR_CODE = {
    SUCCESS: 405,
    SCANNED: 404,
    CANCELLED: 403,
    TIMEOUT: 402,
    ERROR: 500,
    KEEP_ALIVE: 408
}

const platform = "darwin" === process.platform ? "darwin" : "win";

// poll
request({
    url: `${pollUrl}&last=""}&_=${+new Date()}`,
    headers: { "Content-Type": "application/javascript" },
    timeout: 60000
}, (a, b, c) => {
    // 返回了一段js代码
    eval(c);
    const e = window.wx_errcode;
    switch(e) {
        case LOGIN_WX_ERRR_CODE.SUCCESS:
            const loginRedirectUrl = `https://mp.weixin.qq.com/debug/cgi-bin/webdebugger/qrcode?code=${window.wx_code}&state=${platform}`;
            // 拿到登陆信息
            request({ url: loginRedirectUrl }, (a, b, res) => {
                let a = JSON.parse(res);
                let i = b.headers,
                j = i["debugger-signature"],
                k = i["debugger-newticket"],
                l = +new Date(),
                m = {
                  signature: j,
                  newticket: k,
                  openid: a.openid,
                  nickName: a.nickname,
                  headUrl:
                    a.headurl ||
                    "https://res.wx.qq.com/zh_CN/htmledition/v2/images/web_wechat_no_contect.png",
                  ticketExpiredTime: 1e3 * a.ticket_expired_time + l,
                  signatureExpiredTime: 1e3 * a.signature_expired_time + l,
                  sex: 1 === a.sex ? "male" : "female",
                  province: a.province,
                  city: a.city,
                  contry: a.contry
                };
            });
    }
});
```
## 生成体验版二维码

体验版二维码链接： [https://open.weixin.qq.com/sns/getexpappinfo?appid=xxx&path=pages%2Fhome.html#wechat-redirect](https://open.weixin.qq.com/sns/getexpappinfo?appid=wx605e411ab08c87f3&path=pages%2Fhome.html#wechat-redirect "https://open.weixin.qq.com/sns/getexpappinfo?appid=wx605e411ab08c87f3&path=pages%2Fhome.html#wechat-redirect")

⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️⚠️注意
> 预览接口 和 上传接口的 http method 都是 post，下面表格列的参数 是需要附加到url上面的query参数。
post的 body数据就是打包好的.wx文件，示例代码 见文章 [微信小程序上传/预览代码分析](https://www.jianshu.com/p/50dec765939e) 末尾。


## 预览接口
| 接口描述 | 预览小程序 |
| :------| ------ |
| 域名 | https://servicewechat.com |
| 路径| /wxa-dev/testsource |
| 请求方法 | POST |
|入参| 参数见下面 |
|返回| 返回结果见下面 |
#### query参数：
```
{
  _r: '0.8530581592723374', // 随机数
  appid: 'xxx', // 小程序appid
  platform:	0, // 平台
  ext_appid: '',
  os:	'darwin',
  clientversion: '101171018',
  gzip: 1,
  path: 'pages/home?',// 预览页面的路径
  newticket: 'jGUKNzQ59CI5yEoZRgmVP7P6PCnY1xaTv7QSdOXYoIM', // 未知，该数据从登陆接口拿到
  os: 'darwin', // 系统
  clientversion: '1.01.171018'
}
```

返回结果
```
{
	"baseresponse": {
		"errcode": 0,
		"errmsg": "test source success."
	},
	"qrcode_img": " base64 图片	",
    "wxpkg_size": 48269,
	"compile_time": 0,
	"widget_size": 0
}
```

# 上传接口
| 接口描述 | 上传小程序 |
| :------| ------ |
| 域名 | https://servicewechat.com |
| 路径| /wxa-dev/commitsource |
| 请求方法 | POST |
|入参| 参数见下面 |
|返回| 返回结果见下面 |

#### query 入参
```
{
  _r: '0.8530581592723374', // 随机数
  appid: 'xxx', // 小程序appid
  platform:	0, // 平台
  ext_appid: '',
  os:	'darwin',
  clientversion: '101171018',
  "user-version": 1,
  "user-desc": "xxx",
  "uuid": "",
  gzip: 1,
  newticket: 'jGUKNzQ59CI5yEoZRgmVP7P6PCnY1xaTv7QSdOXYoIM', // 未知，该数据从登陆接口拿到
  os: 'darwin', // 系统
  clientversion: '1.01.171018'
}
```
#### 返回结果
```
{
	"baseresponse": {
		"errcode": 0,
		"errmsg": "commit source success."
	},
    "wxpkg_size": 48269,
	"compile_time": 0,
}
```
# 检查是否已经设置了预览版
```
{
  protocol: "https:",
  host: "servicewechat.com",
  pathname: "/wxa-dev-logic/getcommitqrcode",
  query: {
    _r: "0.014995344596100635",
    os: "darwin",
    clientversion: "1011711300",
    appid: "xxx",
    newticket: "uVMVEwpFifCRfXjx53x9ORZsbn1X_ygFWl61kwaEeBg"
  }
}
```