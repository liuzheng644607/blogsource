layout: post
title: javascript操作DOM中遇到的一些坑
date: 2016-01-12 18:18:14
tags: javascript
---
> 来源知乎：https://www.zhihu.com/question/29072028/answer/43095799
> 我们都知道 JavaScript 有 getElementById() 等方法查找对应的元素，但浏览器底层到底是怎么做的？是一个个遍历对象然后对比相应的 id 或者其他属性来对比区分？

# 一.属性相关
我们通常把特征(attribute)和属性(property)统称为属性，但是他们确实是不同的概念，
特征(attribute)会表现在HTML文本中，对特征的修改一定会表现在元素的outerHTML中，并且特征只存在于元素节点中；
属性(property)是对于JS对象进行修改，除了浏览器内置的部分特征外，其它的属性操作并不会影响HTML文本。
<!-- more -->
1. IE6/7不区分属性和特征
其它浏览器会区分属性和特征，而IE67并不会区分它们，在IE67下我们只能用属性名来删除特征，虽然这两个名字很多时候一样，但总会有不一样的地方。
2. IE6/7不能通过getAttribute/setAttribute来操作值不为字符串的特征
在现代浏览器中getAttribute一定会返回HTML中对应的字符串，而IE67返回的结果不可预知，因此在IE67下，我们要用AttributeNode来操作属性。
3. IE6/7/8不能通过style属性来获取CSS文本
这个问题应当是IE6/7不区分属性和特征的后遗症，在获取style这个属性的时候，使用elem.style.cssText就好了。
4. IE6/7会解析相对URL成为绝对URL
这个问题甚至导致了IE6/7下空的src属性会产生重复的请求，可以使用getAttribute('href/src', 4)。
5. 元素特征的默认行为不同
这一类的BUG会比较多，比如在一些旧的webkit浏览器里面，checkbox/radio 的默认值为""，而不是on。在一些旧的webkit浏览器select的第一个元素不会被选中。

# 二.样式操作
通常情况下，样式包括获取和设置行内样式以及获取元素的计算出的样式
1. IE支持background-position-x/y而其它浏览器不支持
background-position-x/y可以用来方便的渐变一个图片的位置，不支持的情况下我们可以考虑使用解析background-position属性的来处理。
2. IE6/7不支持opacity属性
可以通过alpha滤镜来实现相同的效果，不过要记得触发元素的haslayout。
3. IE6/7/8会错误的让clone产生的节点继承一些属性
比如background，修改一个两个同时会改。
4. 不同的获取计算出样式的方式
IE6/7/8使用elem.currentStyle而其它浏览器要用window.getComputedStyle函数。
5.不同的像素化方式
像素化指的是将单位不是像素的距离转换成像素，以方便进行计算。严格的说这不是一个兼容性问题，但可能全用到。在IE6/7/8中，我们可以使用elem.runtimeStyle配合pixelLeft来进行处理。
而现代浏览器可以使用width属性处理。
6. 一些获取CSS时的BUG行为
在Webkti核心的浏览器中，margin-right经常会出错。

# 三.查询操作
查询通过指的是通过一些特征字符串来找到一组元素，或者判断元素是不是满足字符串。
1. IE6/7不区分id和name
在IE6/7下使用getElementById和getElementsByName时会同时返回id或name与给定值相同的元素。由于name通常由后端约定，因此我们在写JS时，应保证id不与name重复。
2. IE6/7不支持getElementsByClassName和querySelectorAll
这两个函数从IE8开始支持的，因此在IE6/7下，我们实际可以用的只有getElementByTagName。
3. IE6/7不支持getElementsByTagName('*')会返回非元素节点
要么不用*，要么自己写个函数过滤一下。
4. IE8下querySelectorAll对属性选择器不友好
几乎所有浏览器预定义的属性都有了问题，尽量使用自定义属性或者不用属性选择器。
5. IE8下querySelectorAll不支持伪类
有时候伪类是很好用，IE8并不支持，jquery提供的:first、:last、:even、:odd、:eq、:nth、:lt、:gt并不是伪类，我们在任何时间都不要使用它们。
6. IE9的matches函数不能处理不在DOM树上的元素
只要元素不在dom树上，一定会返回false，实在不行把元素丢在body里面匹配完了再删掉吧，当然了我们也可以自己写匹配函数以避免回流。

# 四.事件操作
通常一问大家JS的兼容性，第一反应都会是attachEvent和addEventListener，但是关于这两个函数的区别，也还是有很多的细节。
1. 事件作用对象不同
addEventListener为事件冒泡到的当前对象，而attachEvent是window。
. 事件参数对象不同
一定要注意，attachEvent绑定的函数有参数e，不要再写e = e || event了，不过两者的参数属性有很多的差别，如button还是witch，支持不支持pageY等等。
2. 万恶的滚轮事件
滚轮事件的支持可谓是乱七八糟，规律如下：
IE6-11 chrome mousewheel wheelDetla 下 -120 上 120
firefox DOMMouseScroll detail 下3 上-3
firefox wheel detlaY 下3 上-3
IE9-11 wheel deltaY 下40 上-40
chrome wheel deltaY 下100 上-100
3. 三大不冒泡事件
所有浏览器的focus/blur事件都不冒泡，万幸的是大部分浏览器支持focusin/focusout事件，不过可恶的firefox连这个都不支持。
IE678下submit事件不冒泡。
IE678下change事件要等到blur时才触发。
而我们没有什么有效的手段去解决这三个问题，只能通过模拟触发的方式来处理。
4. a.click()
这方法在很多浏览器下都不安全，一执行哪怕阻止了默认行为，还是会造成页面跳转。

# 五.节点操作
节点操作通常指的是复制、生成一个节点或者移动节点的位置。
1.. innerHTML
IE6/7/8使用innerHTML时必须在前面有一个文本节点，不然会造成很多标签丢失。另外很多情况下使用innerHTML会造成defaultValue属性出错。
2. 无用的tbody
IE6/7/8会给空的table自动加一个空的tbody
3. cloneNode时会复制attachEvent的事件
并且除非我们记录了我们绑定的事件，否则我们没办法解绑他们。