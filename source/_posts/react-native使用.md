layout: post
title: react-native使用
date: 2016-07-07 18:46:34
tags: react-native
---
使用react-native也有一段时间了，这个框架使用起来还是有利有弊的。 首先来说web开发者用rn写native app 还是很方便的，至少不用为iOS， android写两套代码，如果开发者有reactjs开发经验的话，那学习成本又降低了不少。其实在RN 应用里还是会不可避免的写区分平台的代码，但这基本上已经降低到需求层面了，所以不是什么大问题，我们知道rn官方提供的某些组件是有平台区分的，所以我们在选用官方组件的时候应该尽量避免有平台差异的组件或者功能，除非你的需求就是要在不通平台上面展示不同的组件。
下面纪录一些我在项目中遇到的问题以及解决办法:

## 多个相同ScrollView同步滚动位置的问题
现在有这样一个需求，在页面上有一个横向菜单导航，菜单项可能会非常多，所以需要支持横向滚动，于是第一时间就想到了使用ScrollView这个组件，设置props `horizontal={true}` 即可实现横向滚动，然后设置 `showsHorizontalScrollIndicator={false}` 把横向滚动条给隐藏掉，好像已经实现了这个需求了。但此时 pm说，我要在页面滚动的时候菜单栏要吸顶(就是一直在页面视口的顶端一直展示)，于是又开始折腾菜单吸顶功能。因为这个菜单栏是被包裹在页面的ListView容器中的，所以第时间想到了使用ListView的 renderSectionHeader功能，但是一查文档发现只有IOS支持这个属性，无奈只能自己实现。平常做吸顶功能的时候我们都是Clone一个容器来吸顶，在页面滑动到合适的位置的时候将吸顶元素展现出来，所以在react中也是同样的道理。 把菜单栏做成一个组件，吸顶元素弄一个单独的容器来放着歌菜单栏组件，也是在合适的时机展现这个元素就行了。 菜单数据使用全局store中对应的state，这样能方便的实现菜单栏组件状态的同步（比如菜单项选中状态啥的）。这里有一个问题就是横向菜单滚动同步的问题，因为是两个容器，所以需要让两个菜单的横向滚动位置保持一致。 `contentOffset` 可以实现给ScrollView设置指定的滚动位置，我看文档上面说这个属性只有IOS才支持，但我试验过后发现android也可以设置。在这个过程中发现一个问题就是，scrollView的contentOffset属性只有在第一次设置才生效，后续的动态设置是不会生效的。最终是使用scrollTo方法来让ScrollView滚动到指定的位置。但是我应该在哪个时候同步滚动距离到两个ScrollView上？是用onScroll属性吗？并不是，使用onScroll属性触发的频率太高了，当然不能这样搞。我需要的是滚动停止过后把当前ScrollView的offset同步到另一个就可以了，看源码发现了 `onMomentumScrollEnd` 属性，onMomentumScrollEnd是在ScrollView 滚动完成过后触发的事件，IOS，Android都支持该属性的，只是我没有看到在文档中写出来。
这时候发现问题似乎解决了～，咦？我刚用手指拉动ScrollView（注意是拉动，生硬的放开，不是滑动），位置怎么没有同步呢？发现它根本没有触发 onMomentumScrollEnd 事件！最后加上了个监听ScrollView的 `onScrollEndDrag` 事件来实现。总体实现就像下面这样：(代码中使用了redux)
```javascript
    export default class NavList extends Component {
    componentDidUpdate() {
        this.refs.navListScroll && this.refs.navListScroll.scrollTo({
            x: this.props.offsetX,
            animated: false
        })
    }
    _syncOffset(e) {
        let x = e.nativeEvent.contentOffset.x;
        this.props.offsetChange(x);
    }

    render() {
        return (
            <ScrollView
                ref="navListScroll"
                onScrollEndDrag={(e) => this._syncOffset(e)}
                onMomentumScrollEnd={(e) => this._syncOffset(e)}
            >
            </ScrollView>
            )
    }
}
```

## dispatch多个action的时候尽量合并
用过redux的同学应该知道，我们要改变store中的state的时候是通过触发对应的action来叼用对应的reducer来完成的。有时候我们可能会在某一段程序里需要改变多个state值，也就是要dispatch 多个 action. 我们知道触发action更行state会触发对应 的view 的render 方法的，如果我们同时更新多个，那么久会触发UI的多处更新。于是合并多个action就显得比较重要了，一个实际的例子是，当一个请求回来的时候，我们很有可能会触发N多的action以更新UI。
具体做法如下： 
1.在action中写一个专门用于合并 操作的action, (types里面是各种action常量)
```javascript
export const mergeAction = (params) => {
    return {
        type: types.MERGE_ACTION,
        payload: params
    }
}
```

2.在reducer中类似于这样写reducer创建函数
```javascript
let reducerInstance;
export default createReducer(initialState, reducerInstance = {
    [ActionTypes.MERGE_ACTION](state, {
        payload
    }) {
        payload && payload.forEach((v)=>{
            state = reducerInstance[v.type].call(this, state, v);
        });
        return state;
    },
    ...
})
```

3. 使用

```javascript
var actions = [];
actions.push(changeLoading(false));
action.push(changeNavList(data.navList));
...
dispatch(mergeAction(actions));

```

## 获取页面元素大小，位置
在rn中，我们想要获取一个元素在页面中的位置,大小的话，可以使用组件 `measure` ， 以及 `measureLayout` 方法。 这两个方法的具体使用方式在[measure和measureLayout](http://reactnative.cn/docs/0.28/nativemethodsmixin.html#content). 需要注意的是你只能在原生的组件上面使用这些方法，不能🐶在复合组件中使用。比如你能在View上面使用，而你不能在自己写的组件NavList 上面使用该方法。 measure 之类的方法需要配合元素的onLayout属性才能正确的获得想要的结果，不能想当然的在元素didMount的时候试图去获取一个元素的大小，位置。此外，如果只想获取元素的大小的话，可以在元素onLayout的时候得到如下：
```javascript
onLayout(e) {
    // 得到元素的宽高
    let { width, height } = e.nativeEvent;
}
```
有一点不爽的是😫，在rn里面计算元素位置之类的功能是异步的，这对于开发者来说是不怎么方便的。在做web开发的时候我们只需要访问一个元素的宽高属性就可以获取，这是相当方便的。

### 动画
动画功能是app交互中的一大利器，幸运的是，rn提供了丰富的动画处理类，主要有两个， `Animated` 和  `LayoutAnimation` ，两者的使用方式有着很大的区别。可以使用 `Animated` 创建出许多复杂的交互动画，自定义程度是非常高的。 `LayoutAnimation` 顾名思义就是布局动画，当布局变化的时候，rn自动的将视图运动到新的位置上去，这个功能非常酷，不需要手动的写动画运动代码，最简单的使用方式是在render之前配置一个 `LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut)` 即可，在该组件重新布局的时候，它会有一个缓动效果。但是比较遗憾   *LayoutAnimation 只能在 `IOS` 平台使用*. 
Animated的使用方式相对比较复杂，但是也能简单的使用。我在项目中使用得最多的也就是Animated.timing 😳，因此不再多说，找时间研究一下。

### 为Image组件设置默认图片
这个可以不必多说，自己把Image组件包裹一层就行了。 这里需要注意的是图片的加载问题，在一个页面上我们可能会有比较多的图片，需要做的是当图片出现在当前视口的时候才加载该图片，否则就显示一个默认的占位图，这功能在大多数手机上是OK的，但是在iPhone4s上面，页面刚渲染就崩溃，究其原因就是渲染图片惹的祸，即使你多个容器都是渲染的同一个图片。因此，我们只能在iPhone4s上面不展示默认图了..., 虽然这样比较挫，但至少不会让app崩溃了。

### 异步回调导致的崩溃...
这个问题其实应该挺常见的，不过怪我忘了给回调加保险。就是上面封装的默认图片站位组件，我们把它叫做CustomImage吧。CustomImage在真实图片加载完成的时候会把默认移除，在移除的时候有一个渐变动画。等渐变动画完全完成的时候（也就是默认图片的opacity值为0）把默认图片给移除，也就是我在回调里面进行了 setState({loading: false}) 操作。此时当图片还在加载过程中的时候用户点击了返回，返回到首页去，那么app就崩溃了。为什么？因为回调函数执行了，它发现在一个unmount的元素上进行了setState. 因此crash。其实找出这个错误还费了一点功夫，报错并不是那么的清晰。最后在组件里面进行了判断，判断当前组件有没有被unmount。做法就是在componentWillUnmount 方法里做一个标志 this._unmount = true; 
```javascript
if (!this._unmount) {
    // 
} 
```

### 样式问题
待续...

