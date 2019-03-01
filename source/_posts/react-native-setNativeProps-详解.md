---
layout: post
title: react-native-setNativeProps-详解
date: 2017-01-09 16:17:21
tags: ['react-native', 'setNativeProps']
---
在React-Native里面，如果要改变组件的样式可以通过state 或者 props来做到。但有些时候由于性能瓶颈，不得不放弃通过触发render的方式来改样式，而是通过setNativeProps 来直接更改原生组件的样式属性 来达到相同的效果。如下图：
![header渐变效果](http://upload-images.jianshu.io/upload_images/188895-23237343a6a4195b.gif?imageMogr2/auto-orient/strip)
上图中的header渐变和搜索框出现都是直通过setNativeProps来实现的。因为header要响应滚动事件，如果使用setState来实现的话，那么render会被频繁的触发，动画会比较卡顿，所以这种情况下，setNativeProps就能派上用场了。

<!-- more -->

实现图中的效果代码很简单，但是冗余代码比较多，所以就不拿来做示例了。下面的代码实现了一个Button组件，点击的时候改变背景色，这就是setNativeProps最常见的使用方式了。
```
class Button extends Component {
    render() {
        return (
            <View ref={(c) => this._refButton = c} style={buttonStyles.button}
             onTouchStart={(e) => this._onTouchStart(e)}
             onTouchEnd={(e) => this._onTouchEnd(e)}
             >
                <Text style={buttonStyles.text}>{this.props.children}</Text>
            </View>
        );
    }

    _onTouchStart(e) {
        /**
         * 这里直接操作style以达到效果
         * @type {Object}
         */
        this._refButton.setNativeProps({
            style: {backgroundColor: '#666'}
        });
    }

    _onTouchEnd() {
        this._refButton.setNativeProps({
            style: {backgroundColor: '#999'}
        });
    }
}
```
那么我们究竟需要在何种情况下使用直接操作？在RN文档里是这样描述的：
> 在（不得不）频繁刷新而又遇到了性能瓶颈的时候。
直接操作组件并不是应该经常使用的工具。一般来说只是用来创建连续的动画，同时避免渲染组件结构和同步太多视图变化所带来的大量开销。setNativeProps
是一个“简单粗暴”的方法，它直接在底层（DOM、UIView等）而不是React组件中记录state，这样会使代码逻辑难以理清。所以在使用这个方法之前，请尽量先尝试用setState
和[shouldComponentUpdate](http://facebook.github.io/react/docs/advanced-performance.html#shouldcomponentupdate-in-action)方法来解决问题。

可以看出，setNativeProps有时候非常的好使，对于用惯了JQ的人来说简直就是福音...🐶🙄。但是我并没有在官方文档找到哪些属性可以用setNativeProps来操作，大家只是猜猜，嗯，style属性应该可以，于是乎就就用起来了。下面是我整理出来的可以直接操作的属性列表：
**View**
>pointerEvents
accessible
accessibilityLabel
accessibilityComponentType
accessibilityLiveRegion
accessibilityTraits
importantForAccessibility
testID
renderToHardwareTextureAndroid
shouldRasterizeIOS
onLayout
onAccessibilityTap
onMagicTap
collapsable
needsOffscreenAlphaCompositing
**style**

**Text**
除了包含上面**View**的所有属性外还包括:
>isHighlighted
numberOfLines
ellipsizeMode
allowFontScaling
selectable
adjustsFontSizeToFit
minimumFontScale

**Image**
包含**View**所有支持的属性， Android 与 IOS 略有不同。Android平台下，Image组件有children的时候 和 IOS支持的属性列表一样，如果Image没有children，那么它还包含如下属性：
>src
defaultSource
loadingIndicatorSrc
resizeMode
progressiveRenderingEnabled
fadeDuration
shouldNotifyLoadEvents

其实上面这些东西都是在RN源码里面能找得到的，你要是不确定某个属性能否通过setNativeProps 设置的话，可以去对应组件的源码里面查看，它被封装在组件的viewConfig 属性里面。所以`node_modules/react-native/Libraries/Image/Image.ios.js` 里面有这样的代码:
```
const Image = React.createClass({
  /**
   * `NativeMethodsMixin` will look for this when invoking `setNativeProps`. We
   * make `this` look like an actual native component class.
   */
  viewConfig: {
    uiViewClassName: 'UIView',
    validAttributes: ReactNativeViewAttributes.UIView
  },
  
  ...
  render: function() {
      ...
      return (
      <RCTImageView
        {...this.props}
        style={style}
        resizeMode={resizeMode}
        tintColor={tintColor}
        source={sources}
      />
    );
  }
});
```
可以看出Image组件并没有把比较重要的prop `source` 没有被纳入到可被直接修改的列表中。在iOS 平台，RN暴露给我们的Image 是一个复合组件， 原生的`RCTImageView` 所接收的source 需要一个数组，而封装过的Image 需要的是一个Object， 使用setNativeProps会有点奇怪吧。还有在Android平台，`RKImage` 和  `RCTTextInlineImage`  需要的是src属性，也是一个数组。

**如果你非要使用setNativeProps来改变Image的source**，可以像下面这样继承Image
```
class MyImage extends Image {
    viewConfig = Object.assign({} , this.viewConfig, {
        validAttributes: Object.assign(
            {},
            this.viewConfig.validAttributes,
            {[Platform.OS === 'ios' ? 'source' : 'src']: true})
        });

    constructor() {
        super();
        this.setNativeProps = (props = {}) => {
            
            if (props.source) {
                const source = resolveAssetSource(props.source);
                let sourceAttr = Platform.OS === 'ios' ? 'source' : 'src';
                let sources;
                if (Array.isArray(source)) {
                    sources = source;
                } else {
                    sources = [source];
                }
                Object.assign(props, {[sourceAttr]: sources});
            }

            return super.setNativeProps(props);
        }
    }
}


// 实现
class TestDemo extends Component {
  
  // 设置source
   _setSource() {
        this._refImg.setNativeProps({
            source: {uri: 'https://ss1.baidu.com/6ONXsjip0QIZ8tyhnq/it/u=2478206899,4000352250&fm=80&w=179&h=119&img.JPEG'}
        });
    }

    render() {
         return(
            <MyImage
              ref={(c) => this._refImg = c}
              style={styles.box}
              source={{uri: 'https://ss0.baidu.com/6ONWsjip0QIZ8tyhnq/it/u=3497889018,3008123053&fm=80&w=179&h=119&img.JPEG'}} />
         )  
     }

}
```
 **但是，但是，但是**，上面滴代码只是为了探讨一种方案，以及研究在RN里面setNativeProps是如何工作的，我们是 **不可能** 真正在项目中使用的，仅仅是学习之用。 既然都继承了一个新的类， 为什么自定义一个组件来实现想要的功能呢，用setState多方便。

对于setNativeProps 和 react 推崇的思想之间的矛盾，我觉得他们是可以共存的。 对于不同的业务/技术 场景 ，选择更适合的就是最好的。