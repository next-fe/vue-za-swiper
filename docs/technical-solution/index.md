# vue-za-swiper 技术方案
![img_26.png](../assets/img_26.png)

## 前言
最近在做业务的时候，产品同学提了这样一个需求：
![vue-za-swiper-function.png](../assets/vue-za-swiper-function.png)

找了一遍开源没有合适的，于是决定自己写一个。大体思路主要参考 [Swiper](https://swiperjs.com)，监听 `touchmove` 事件，动态改变 `translateX` 实现滑动，在滑动到达边界的时候设置特定的 `translateX` 制造循环滑动效果。本文主要介绍手势滑动和按钮滑动的技术方案，阅读文章时可以结合 [仓库代码](https://github.com/next-fe/vue-za-swiper) 一起阅读。

![img.png](../assets/img.png)

此文接下来都会以这个 8 个元素的列表作为例子，假设 Swiper Container 容器可视元素是 4 个，讲解 ZSwiper 的手势滑动和按钮滑动功能。

## 初始化
如上图所示，为了避免向左滑动到最左边或者向右滑动到最右边的时候，滑动距离过大，而出现看不到元素的情况，我们需要拷贝一份数组分割成两部分，分别拼接在原来的首和尾。

```js
initDoubleList() {
  const mid = Math.floor((this.list.length / 2));
  this.halfLen = mid;
  this.doubleList = [ ...this.list.slice(mid), ...this.list, ...this.list.slice(0, mid) ]
}
```

接着计算出左边界的位置，将第 1 个元素，也就是索引 0 的元素，放到容器最左边。计算出右边界的位置，用于后面计算。

```js
initTranslateX() {
  const translateX = this.getDomTranslateX() - this.itemFullWidth * this.halfLen;
  this.setDomTranslateX(translateX);
  return Math.abs(translateX);
},

mounted() {
  this.initItemFullWidth();
  const initialTranslateX = this.initTranslateX();
  this.leftBorder = initialTranslateX;
  this.rightBorder = this.itemFullWidth * this.list.length + initialTranslateX;
}  
```

## 手势左右滑动
![img_13.png](../assets/img_13.png)

如上图所示，手势滑动思路比较简单，主要难点在于在滑动到达边界的时候，如何制造循环。结合上面第 2 张图看，比如我们一直向右滑，滑到右边界（RightBorder）的时候，将 `translateX` 置回左边界（LeftBorder），就可以产生向右无限滚动的效果。

```js
touchstart(evt) {
  const touch = evt.targetTouches[0];

  this.lastX = touch.pageX;
  this.translateX = this.getDomTranslateX();
}

touchmove(evt) {
  const touch = evt.targetTouches[0];
  const xDiff = touch.pageX - this.lastX;

  this.lastX = touch.pageX;
  this.setMove(xDiff);
}

setMove(xDiff) {
  this.translateX += xDiff;
  const translateXAbs = Math.abs(this.translateX);

  if (translateXAbs >= this.rightBorder) {
    this.translateX = -(this.leftBorder + (translateXAbs - this.rightBorder));
  } else if (translateXAbs <= this.leftBorder) {
    this.translateX = -(this.rightBorder - (this.leftBorder - translateXAbs));
  }

  this.setDomTranslateX(this.translateX);
}
```

## 点击按钮滑动
### 点击左滑
下面以点击左按钮滑动为例进行讲解。因为点击按钮时元素可能处于被截断的状态，产品同学希望滑动停止后被截断的元素完全可见，拆解下需求变成下面这样：

![img_1.png](../assets/img_1.png)

先看下整体流程，如下代码所示，用户点击按钮先触发 `handleSlide()`，先设置动画属性，然后调用 `_slidePrev()` 刷新 `translateX` 出现动画效果，滑动动画结束后再移除动画属性。

```js
mounted() {
  // 使用 throttle 避免用户快速连续点击导致动画出问题
  this.handleSlide = throttle(() => {
    Object.assign(this.$refs.swiperWrapper.style, {
      'transition-duration': `${ this.slideAnimationDuration }ms`,
    });

    this.translateX = this.getDomTranslateX();
    this._slidePrev();
    
    setTimeout(() => {
      Object.assign(this.$refs.swiperWrapper.style, {
        'transition-duration': '0ms',
      });
    }, this.slideAnimationDuration);

  }, this.slideAnimationDuration + 200, {
    trailing: false,
  });
},
methods: {
  getObserveEntries() {
    return new Promise((resolve) => {
      const observer = new IntersectionObserver((entries) => {
        observer.disconnect();

        resolve(entries);
      }, {
        root: this.$refs.swiperBody,
      });

      this.$refs.swiperItems.forEach((el) => {
        observer.observe(el);
      });
    })
  },
  _slidePrev() {
    this.getObserveEntries().then(((entries) => {
      const lastVisibleIndex = entries
        .findLastIndex((item) => item.intersectionRatio >= this.intersectionRatioThreshold)

      const isAllVisible = entries
        .filter((item) => item.intersectionRatio >= this.intersectionRatioThreshold).length === this.halfLen

      const targetIndex = isAllVisible ? lastVisibleIndex - 1 : lastVisibleIndex
      const target = entries[targetIndex]

      const xDiff = target.rootBounds.right - target.boundingClientRect.right
      this.translateX += xDiff
      this.setDomTranslateX(this.translateX)

      const translateXAbs = Math.abs(this.translateX)
      setTimeout(() => {
        if (translateXAbs <= this.leftBorder) {
          this.translateX = -(this.itemFullWidthValue * (targetIndex - this.halfLen + 1 + this.list.length))
          this.setDomTranslateX(this.translateX)
        }
      }, this.slideAnimationDuration)
    }))
  },
}
```

接下来看看 `_slidePrev()` ，利用 [IntersectionObserver](https://developer.mozilla.org/zh-CN/docs/Web/API/IntersectionObserver) API 我们可以得知是容器刚好四个元素全部可见，

![img_2.png](../assets/img_2.png)

还是处于非全部可见状态。根据不同情况计算位移 `xDiff`，然后与当前 `translateX` 进行运算，即可得到下一个位置的 `translateX`。图中红色元素表示代码中的 `target`，而橙色元素表示我们希望最终落在 Swiper Container 最左侧的元素。因为 Swiper Container 是刚好 4 个元素可见的，所以只要 `target` 移到至最右侧，橙色元素必定在最左侧。

![img_3.png](../assets/img_3.png)

![img_4.png](../assets/img_4.png)

下图是滑动结束后，进入了左边界的情况。这时 `targetIndex` 是 `6`，为了制造循环，我们的目标是要让索引为 `14` 的元素出现在 Swiper Container 最右边。但是 `translateX` 的定位是从 Swiper Container 最左边算起的，也就是说如果索引为 `11` 的棕色元素出现在最左边，那边最右边的元素肯定是索引为 `14` 的元素。由此可以推理出以下公式计算 `finalTranslateX`：

```js
if (translateXOpt <= this.leftBorder) {
  // targetIndex: 6
  // halfLen: 4
  // 6 + 1 - 4 + 8 = 11
  this.translateX = -(this.itemFullWidth * (targetIndex + 1 - this.halfLen + this.list.length));
  this.setDomTranslateX(this.translateX);
}
```

![img_5.png](../assets/img_5.png)

有一个需要注意的点，边界计算要放到 `setTimeout` 中等到 `transition-duration` 被移除后才做。不然会因为 `translateX` 由右边界变到左边界这个过程加上动画，就会出现「转了一个圈」的奇怪动画效果。

### 点击右滑
右滑一般情况的计算方法基本与左滑一致，这里贴两张图展示下 `xDiff`，计算方法就不展开讲了。

![img_6.png](../assets/img_6.png)
![img_7.png](../assets/img_7.png)


下图是滑动结束后，进入了右边界的情况。这时 `targetIndex` 是 `12`，为了制造循环，我们的目标是要让索引为 `4` 的棕色元素出现在 Swiper Container 最左边，向前移动一个数组的长度即可。由此可以推出以下公式：

```js
if (translateXAbs >= this.rightBorder) {
  this.translateX = -(this.itemFullWidthValue * (targetIndex - this.list.length))
  this.setDomTranslateX(this.translateX)
}
```
![img_9.png](../assets/img_9.png)

完。

## 相关链接
- [vue-za-swiper 仓库](https://github.com/next-fe/vue-za-swiper)
- [Swiper 官网](https://swiperjs.com)
