---
layout: post
title: Javascript Decorators 初探
date: 2017-01-04 21:54:36
tags: [javascript, decorator]
---
![javascript decorator](http://upload-images.jianshu.io/upload_images/188895-bb0a965e2fb5aded.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

> 现在什么 **AOP** 编程在前端领域越来越被大家追捧，所以我也来探究一下如何在javascript中进行AOP编程。 装饰器无疑是对AOP最有力的设计，在es5 时代，可以通过 `Object.defineProperty`来对对象属性／方法 进行访问修饰，但用起来需要写一堆东西。现在decorator已经在ES7的提案中了，借助Babel等转码工具，我们现在也能在javascript中使用装饰器语法了！
<!-- more -->

#### 什么是Decorator

decorator 也叫装饰器(装潢器)。它可以在不侵入到原有代码内部的情况下而通过标注的方式修改类代码行为，装饰器对代码行为的改变是在编译阶段完成的，而不是在执行阶段。虽然Decorator还处在ES7草案阶段，但是我们可以通过Babel来转换es7代码，所以大家还是可以愉快的使用decorator。
在ES7提案中，Decorator的描述如下：
> * an expression
> * that evaluates to a function
> * that takes the target, name, and decorator descriptor as arguments
> * and optionally returns a decorator descriptor to install on the target object.
> 出自 https://github.com/wycats/javascript-decorators

在代码层面，Decorator其实就是一个函数。

```javascript
function readonly(target, name, desc) {
  desc.writable = false;
  return desc;
}

let o = {
  @readonly  // 标识为只读属性
  name: 'liuyan'
}

// 赋值失败并报错
o.name = 'liuzheng'; // Cannot assign to read only property 'name' of object '#<Object>'
```

上面的代码实现了一个简单的装饰器用来使对象属性只读。函数`readonly` 规定了装饰器描述符的行为。不难看出，这和ES5中的 `Object.defineProperty` 方法很类似，使用es5
代码一样能够实现相同的功能，其实使用Babel转码最终也就是转换成了`Object.defineProperty` 的实现形式，只是使用  `@readonly` 这种语法更能直观的描述出来， 对比Java中的注解、 Python中的装饰器其实都使用类似的语法。

#### Decorator用法
**给属性添加Decorator** 
和前面的例子一样，有时候需要在JS中实现类静态成员，这个时候就可以使用Decorator来修饰了,代码如下：
```javascript
// 示例
class Person {
  @readonly
  static MIN_AGE = 0;
}
```
这样，当不小心重新为 Person.MIN_AGE 赋值的时候，就会抛出错误。

**给方法添加Decorator** 
也可以对方法进行装饰。比如现在需要实现一个功能： 设计一个装饰器，它能够统计出一个异步方法(这里只用Promise)的耗时。还是以Person类为例，给Person增加一个request方法，统计request执行耗时，代码实现非常简单：
```javascript
class Person {
  static MIN_AGE = 0;
  constructor(name) {
    this.name = name
  }
 
  @duration
  request() {
    return new Promise((resolve, reject) => {
       setTimeout(() => {
         resolve({status: 0})
       }, 3000);
    })
  }
}

// 装饰器
function duration(target, key, desc) {
  const { value } = desc;
  let _time = Date.now();
  desc.value = function(...args) {
    let res = value.apply(this, args);
    if (res && typeof res.then === 'function') {
      res.then(() => {
        console.log(`${key}() ==> 耗时:${Date.now() - _time}ms`);
      }, () => {
        console.log(`${key}() ==> 耗时:${Date.now() - _time}ms`);
      })
    } else {
      console.log(`${key}() ==> 耗时:${Date.now() - _time}ms`);
    }
    return res;
  }
  // 需要把描述对象返回
  return desc;
}

// 开始
var p = new Person('liuyan');
p.request(); // 输出:  request() ==> 耗时:3002ms
```
**作用于class**
也可以在为class 应用装饰器，现在我要通过装饰器给Person类增加一个静态属性IS_PERSON; (当然，这没什么卵用...)
```javascript
// 增加静态属性IS_PERSON
@isPerson
class Person {
  ...
}

function isPerson(target) {
  target.IS_PERSON = true;
}

console.log(Person.IS_PERSON); // true
```
也可以作用于class的实例属性
```javascript
class Person {
  ...
}

function sayHi(target) {
  const {sayHi} = target.prototype;
  target.prototype.sayHi = function(...args) {
    if (typeof sayHi === 'function') {
      var res = sayHi.apply(this, args);
    }
    console.log(`Hi, I\'m ${this.name}`);
    return res;
  };
}

var p = new Person('liuyan');
p.sayHi(); // Hi, I'm liuyan
```
decorator作用于类最常见的用法就是mixins了，mixin 也就是允许我们为组件(类) 附加额外的功能，用过react的童鞋应该对mixin不陌生，不过使用mixin扩展新功能这种用法已经[不被推荐](https://medium.com/@dan_abramov/mixins-are-dead-long-live-higher-order-components-94a0d2f9e750#.5hx3ugz68)了。
decorator已经在各知名框架中开始大面积使用，比如Angular2（ng2）, 虽然ng2使用TypeScript 来构建的，但是装饰器这种语法实现也是大同小异的。下图是从angular js官网截取的示例代码：

![Angular2中，大量使用了decorator](http://upload-images.jianshu.io/upload_images/188895-ef577d24f7fa9332.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

#### 实际使用场景（Logger）
一个东西被吹得再好，如果没有使用场景那也是白搭。
在实际业务中，很多时候把装饰器用在日志工具上面，因为日志这种东西和业务几乎是完全分离的，试想一下，如果业务代码里面参杂了各种各样的日志信息...., 对于阅读代码逻辑以及维护来说都是灾难性的，这个时候我们的decorator就能派上用场了。
假设需要实现一个对定时任务的监控logger， 需要监控何时开始、结束，以及任务运行耗时的信息。代码如下

```javascript
class ScheduleJob {
  constructor(name) {
    this.name = name;
  }
  @log('info', '开始')
  start() {
    setTimeout(() => {
      this.stop();
    }, 2000);
  }
  
  @log('info', '结束')
  stop() {}
}

var job = new ScheduleJob('liuyan');
job.start();

//输出: 
//Thu Jan 05 2017 18:34:09 GMT+0800 (CST) - info - 开始 
//Thu Jan 05 2017 18:34:09 GMT+0800 (CST) - info - 开始....time: 1483612449481
//Thu Jan 05 2017 18:34:12 GMT+0800 (CST) - info - 结束 
//Thu Jan 05 2017 18:34:12 GMT+0800 (CST) - info - 结束....time: 1483612452258，耗时：2777ms 

function log(t = 'info', msg = '') {
  return function(target, name, desc) {
    
    const {value} = desc;
    
    desc.value = function(...args) {
      console.log(`${new Date()} - ${t} - ${msg} `)
      let res = value.apply(this, args);
      if(name === 'start') {
        this[`startTime`] = Date.now();
        console.log(`${new Date()} - ${t} - 开始....time: ${this[`startTime`]}`)
      }
      if( name === 'stop' ) {
        this[`endTime`] = Date.now();
        console.log(`${new Date()} - ${t} - 结束....time: ${this[`endTime`]}，耗时：${this[`endTime`] - this[`startTime`]}ms`)
      }
    }
  }
}
```
上面的是一个很简单的需求，我们没有修改原有类的任何代码就实现了日志监控。其实这种实现在编程器思想里面叫做 AOP，中文名也叫面向切面编程，java里面用得非常之多。

网上有牛人写了一些常用的decorators  [core-decorators](https://github.com/jayphelps/core-decorators.js)，源码比较简单，可以学习学习。

####参考资料
decorator描述: https://github.com/wycats/javascript-decorators 
core-decorators.js   https://github.com/jayphelps/core-decorators.js
decorators 文档  http://tc39.github.io/proposal-decorators/