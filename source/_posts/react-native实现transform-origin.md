---
layout: post
title: react-native实现transform-origin
date: 2017-05-17 16:25:25
tags: ['react-native', 'transform', 'matrix']
---

>最近在做RN项目的时候，有一个旋转效果需要指定非元素中心的原点。我们都知道在CSS3里进行transform变换的时候，默认的变换原点是元素的中心位置，css3提供了transform-origin属性来设置变换原点，但是在RN里，我翻遍了官方文档和一些源码都没有看到可以在设置类似transform-origin东西，但是RN的transform支持 matrix。

## 一个使用矩阵实现缩放的栗子
将图片旋转放大2倍，我们用matrix实现

<!-- more -->

```javascript
export default class App extends Component {
  render() {
    return (
      <View style={styles.container}>
          <Image style={[
            styles.imageBox,
            {transform: [{matrix: [
                2, 0, 0, 0,
                0, 2, 0, 0,
                0, 0, 1, 0,
                0, 0, 0, 1]}]}
            ]} 
            source={{uri: 'http://www.google.cn/landing/cnexp/google-search.png'}} />
      </View>
    );
  }
}
```
这个时候的效果就和使用scale(2) 一毛一样。

顺便提一下，话说在transform的matrix属性是在rn的某个版本中才加入的，更老的版本使用的是 `transformMatrix` 属性，它与transform平级。

## 指定变换中心(transform-origin)
这里主要说明transform-origin的实现原理。其实transform-origin在css规范里面也有具体的说明。
```
div { 
  height: 100px; 
  width: 100px; 
  transform-origin: 50px 50px; 
  transform: rotate(45deg);
}
```
The [transform-origin](https://www.w3.org/TR/css-transforms-1/#propdef-transform-origin) property moves the point of origin by 50 pixels in both the X and Y directions. The transform rotates the element clockwise by 45° about the point of origin. After all transform functions were applied, the translation of the origin gets translated back by -50 pixels in both the X and Y directions.

也就是如下这幅图，出自[这里](https://www.w3.org/TR/css-transforms-1/#propdef-transform-origin)
![css规范中的表述](http://upload-images.jianshu.io/upload_images/188895-9ed334e7f0fbe653.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

翻译一下就是，***要想指定变换原点，其实只需要先把元素的中心平移到变换原点，然后开始变换，完了过后再反向平移到原来的位置。***

说得这么晦涩，什么变换啥的，其实矩阵变换对应到数学上就是进行矩阵乘法，不知道基础的同学建议先看看相关的知识，线性代数、基本图形变换之类的。

## demo
[代码在这里, 可在线预览](https://snack.expo.io/ByANEuKeZ)， 有可能需要科学上网才能访问到。
下面选取了部分关键代码说明一下
```javascript

    // 旋转中心
    const transformOrigin = [50, -50];
    const translate = [
       1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       transformOrigin[0], transformOrigin[1], 0, 1
      ];
    const unUseTranslate = [
       1, 0, 0, 0,
       0, 1, 0, 0,
       0, 0, 1, 0,
       -transformOrigin[0], -transformOrigin[1], 0, 1
      ];
    const a = Math.PI/6;
    const rotateMatrix = [
       Math.cos(a), Math.sin(a), 0, 0,
      -Math.sin(a), Math.cos(a), 0, 0,
       0,            0,          1, 0,
       0,            0,          0, 1
      ];
    
    // 结果矩阵
    // 先平移到旋转中心，再旋转
    let m = Matrix.multMatrix(translate, rotateMatrix);
    
    // 再平移回去
    m = Matrix.multMatrix(m, unUseTranslate);
    
    this.setState({
      matrix: m
    });
```
 图片(容器)大小为100*100，我们如果要设置变换中心为图片的右上角的话，那么需要的旋转中心应该是 `transformOrigin = [50, -50]`; 这里为什么是`[50, -50]`呢？而不是像css属性里的是`transform-origin: 100px, 0`。 这是因为进行矩阵变换的时候，所应用的坐标系是元素的本地坐标系(local coordinate space)，图片的中心是`0,0`, x轴向右为正，y轴向下为正。所以此时图片的右上角所对应的坐标是(50, -50).如下图
![local coordinate space](http://upload-images.jianshu.io/upload_images/188895-657c4e0eef524d83.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

## 结语
我这代码中的矩阵操作全是手动撸的，矩阵变换本来就是个麻烦而且枯燥的工作，所以如果大家在实际项目中需要用到各种矩阵操作的话，可以推荐 [gl-matrix](https://github.com/toji/gl-matrix) 这个库。react-native项目里面的话，可以直接使用 [MatrixMath](https://github.com/facebook/react-native/blob/master/Libraries/Utilities/MatrixMath.js) 模块。
如果深究一下css 的transform 文档，其实会发现所有的变换都可以用矩阵来表示，比如`perspective`，`perspective-origin`等属性。