layout: post
title: web中ajax操作的统一处理
date: 2016-01-29 15:38:35
tags: [javascript, jQuery]
---

## 前言

> 在web开发中，使用ajax请求服务器资源已经是非常普遍的做法了。也许有这样的需求, 在某个系统中的所有访问都是需要进行权限控制的，服务端判断用户权限，如果没有对应资源的访问权限的话那么返回一个约定好的状态码，前端拿到这个状态码进行相应的UI提示。可是，在前端中也许有非常多的这样的请求，没次请求过后都要判断一下状态码然后给出相应的提示，这样会写非常多的重复代码，当改了提示消息的时候就需要到每个ajax回调里面去改，非常不方便。因此我们需要一个统一的方式来接管ajax请求，也就是在执行业务方写的回调的时候，先执行需要验证的前置条件(前面说的状态码).下面就在使用jQuery的时候我们如何来拦截。

<!-- more -->

## 方式1, 拦截$.ajax方法


第一想到的是改造jQuery的ajax方法，在回调函数里面加入统一处理的逻辑。但是这样的话就是完全覆盖了$.ajax方法，代码写起来倒是简单.一步一步实现

```javascript
// 首先保存原有的$.ajax方法
var ajax = $.ajax,
    noop = function() {};

//重写$.ajax
//保持和原生的$.ajax方法参数一致
$.ajax = function(options) {

    /**
     * 保存业务代码中传递的成功回调和失败回调
     */
    var func = {
        success:  'function' === typeof options.success ? options.success : noop,
        error: 'function' === typeof option.error ? options.error : noop
    }

    var _ops = $.extend({}, option, {
            success: function(data, state, xhr) {
                /**
                 * 统一处理的逻辑, 例如
                 */
                if (+data.status !== 0) {
                    /**
                     * code here
                     */
                    return;
                }
                /**
                 * 调用业务端的回调。
                 */
                func.success(data, state, xhr);
            },
            error: function(e) {
                //类似success里面的代码
                func.error(e);
            }
        });

    return ajax.call($, _ops);
}


```
当然，基于上面的代码可以做很多的通用性处理，比如在beforeSend的时候设置统一的header等操作，都可以通过重写回调的方式来实现。

## 方式2,自己封装一个统一的ajax工具供业务里面使用

比如自己写一个AjaxUtil.js暴露给业务使用, 在这里面进行统一处理. 其实也类似于方式1， 只是这样没有污染jquery 原有的ajax方法.