---
layout: post
title: echarts-扩展-toolbox
date: 2017-07-01 16:30:01
tags: ['echarts', 'javascript']
---

##前言##
[echarts](https://github.com/ecomfe/echarts)是百度前端团队推出的一个非常强大的开源图表库，我最近在重构的一个内部后台系统也用到了echarts，但是梳理老代码的时候发现有人居然改了`node_modules/echarts`里面的代码😢。梳理了一下功能，其实当时的需求就只想把“保存图片”的那个按钮的逻辑改为下载excel（也不知道为什么产品要在这个位置放导excel的按钮...）。

![ecahrts中的toolbox](http://upload-images.jianshu.io/upload_images/188895-d9b08ece2fe42010.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

<!-- more -->

##开始##
我顺着echarts找到了toolbox模块，在`node_modules/lib/component/toolbox/feature` 下面有几个文件就是echarts toolbox已有的一些功能。发现几个功能都是需要实现同样一套接口来添加对应的按钮和功能，于是照葫芦画瓢，按照`SaveAsImage.js` 里面的代码实现一个类似的下载excel的工具。需要给class指定一个类属性`defaultOption`为默认配置，需要实现`onclick`方法。

**SaveAsExcel.js**
```javascript
/**
 * @Author: lyan
 * @Date:   2017-06-30T12:40:29+08:00
 * @Email:  liu-yaner@foxmail.com
 * @Description: 扩展echarts 的tool box，增加导出excel功能
 */

// 环境判断
var env = require('zrender/lib/core/env');

export default class SaveAsExcel {
    constructor(model) {
        this.model = model;
    }

    get unusable() {
        return !env.canvasSupported;
    }

    onclick() {
        const model = this.model;
        const url = model.get('url');
        window.open(url);
    }
}

// 默认配置
SaveAsExcel.defaultOption = {
    show: true,
    // 功能图标，可以使用svg的path、可以是一张网络图片，如果是图片的话，需要加上image://前缀，比如icon: 'image://http://example.com/xxx.png'
    icon: 'M4.7,22.9L29.3,45.5L54.7,23.4M4.6,43.6L4.6,58L53.8,58L53.8,43.6M29.2,45.1L29.2,0',
    title: 'export',
    url: '#'
};

// 必须注册feature
require('echarts/lib/component/toolbox/featureManager').register(
   // 功能名字   
   'saveAsExcel',
    SaveAsExcel
);
```
##使用##
如果你要在项目中引入全量的echarts，需要在引入echarts之前 引入SaveAsExcel.js
```javascript
import './yourPath/SaveAsExcel';
import echarts from 'echarts';
....
```
如果是[部分引入](http://echarts.baidu.com/tutorial.html#%E5%9C%A8%20webpack%20%E4%B8%AD%E4%BD%BF%E7%94%A8%20ECharts), 则在引入toolbox之前 引入SaveAsExcel.js
```javascript
//  引入 ECharts 主模块
var echarts = require('echarts/lib/echarts');
//  引入柱状图
require('echarts/lib/chart/bar');
//  引入扩展的工具按钮
require('./yourPath/SaveAsExcel');
// 引入toolbox
require('echarts/lib/component/toolbox');
```

在业务代码里面使用
```javascript
const opt = {
    ...
    toolbox: {
        feature: {
            // 自定义的下载按钮
            saveAsExcel: {
                url: `xxxx.jsp`,
                title: '下载'
            }
        }
    }
};
```
效果

![image.png](http://upload-images.jianshu.io/upload_images/188895-44ab5f1a4d63eafa.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 结语
通过这样的扩展方式，既实现了功能，也不会修改原有代码的功能，个人认为还是一种比较好的方式吧，如果需要更多更复杂的功能 ，其实都可以通过类似的方式来实现 ，当然这就需要对echarts源码吃透一点了。
由于笔者能力有限，如果文章中有哪里不对的地方，还请拍砖指正。希望本文对你有所帮助～～😊。