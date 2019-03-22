---
layout: post
title: 使用@route装饰器简化koa-router写法
date: 2019-03-22 12:38:24
tags: [koa-router, 装饰器]
---

## 前言
本文所有代码见[github](https://github.com/liuzheng644607/project-start-seed/tree/master/src/server)

## koa-router
[koa-router](https://www.npmjs.com/package/koa-router)是[koa](https://www.npmjs.com/package/koa)项目中被广泛使用到的一个路由中间件。
koa-router的基本使用方法如下：
```javascript
var Koa = require('koa');
var Router = require('koa-router');
 
var app = new Koa();
var router = new Router();
 
router.get('/', (ctx, next) => {
  // ctx.router available
});
// 在app中使用routes中间件
app
  .use(router.routes())
  .use(router.allowedMethods());
```
可以看到，如果项目中有很多路由，那么我们需要写很多的类似`router.get('xxx', () => {})`这样的代码，重复劳动（多写了几个单词？）。我们需要一种方式来简化router的书写，decorator（装饰器/注解）登场了。
<!--more-->
## @RequestMapping
熟悉java spring开发的同学一定对`@RequestMapping`， `@Controller`这些注解不陌生。
比如用户登录接口`/user/login`, 对应java spring路由写法如下：
```java
@RequestMapping(path = "/user")
public class UserController {
	@RequestMapping(path = "/login", method={RequestMethod.POST})
	public String login() {
		return "success";
	}
}
```
在javascript里也可以使用类似的写法，接下来我用装饰器来描述路由。

## 书写Controller

假如我们的Controller文件如下, 我们一步一步实现这样的写法，[访问 api/monitor/alive](https://draw.lyan.me/api/monitor/alive)
monitor.ts
```
import { route } from '@server/decorator/router';
@route('/api/monitor')
export default class {
  @route('/alive')
  monitor() {
    return {
      data: true,
      message: '成功'
    };
  }
}
```
### 实现@route装饰器
可以看出@route装饰器既能装饰Class，也能装饰成员方法；当装饰Class的时候，仅仅相当于给路由添加前缀；装饰成员方法的时候，即路由需要执行对应的方法。并返回Response到浏览器。
route.ts 代码如下：
```
import { Context } from 'koa';
import * as assert from 'assert';
import * as Router from 'koa-router';

type Middleware = Router.IMiddleware;

export enum RequestMethod {
  GET = 'get',
  POST = 'post',
  DELETE = 'delete',
  ALL = 'all',
  PUT = 'put',
  HEAD = 'head',
  PATCH = 'patch',
}

// tslint:disable-next-line:no-any
const methodList = Object.keys(RequestMethod).map((k: any) => RequestMethod[k]);

type Method = 'get' | 'post' | 'put' | 'delete' | 'all' | 'head' | 'patch';

const rootRouter = new Router();

export function route(url: string | string[],
                      method?: Method,
                      // tslint:disable-next-line:no-any
                      middlewares: Middleware[] | Middleware = []): any {
  // tslint:disable-next-line:no-any
  return (target: any, name: string, descriptor?: any) => {

    const midws = Array.isArray(middlewares) ? middlewares : [middlewares];

    /**
     * 装饰类
     */
    if (typeof target === 'function' && name === undefined  && descriptor === undefined) {
      assert(!method, '@route 装饰Class时，不能有method 参数' );

      /**
       * 我们将router绑定在 原型上，方便访问
       */
      if (!target.prototype.router) {
        target.prototype.router = new Router();
      }
      /**
       * 仅仅设置Controller 前缀
       */
      target.prototype.router.prefix(url);

      /**
       * 使得当前Controller 可以执行一些公共的中间件
       */
      if (middlewares.length > 0) {
        target.prototype.router.use(...midws);
      }
      return;
    }

    /**
     * 装饰方法
     */
    if (!target.router) {
      target.router = new Router();
    }

    if (!method) {
      method = 'get';
    }

    assert(!!target.router[method], `第二个参数只能是如下值之一 ${methodList}`);
    assert(typeof target[name] === 'function', `@route 只能装饰Class 或者 方法`);

    /**
     * 使用router
     */
    target.router[method](url, ...midws, async (ctx: Context, next: Function) => {
      /**
       * 执行原型方法
       */
      const result = await descriptor.value(ctx, next);
      ctx.body = result;
    });

    /**
     * 将所有被装饰的路由挂载到rootRouter，为了暴露出去给 koa 使用
     */
    rootRouter.use(target.router.routes());
  };
}

/**
 * 暴露router给koa使用
 */
export function getRouter() {
  return rootRouter;
}

```
### 加载Controller

```
import { getRouter } from '@server/decorator/router';
import './hello';
import './monitor';

export default getRouter().routes();

```
本文一些思路借鉴于[这里](https://github.com/xmlking/koa-router-decorators)