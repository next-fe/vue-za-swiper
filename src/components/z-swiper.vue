<template>
  <div class="z-swiper">
    <div class="z-swiper__btn"
         v-if="useLeft"
         @click="slideLeft"
         :style="customBtnStyle">
      <slot name="left"/>
    </div>

    <div class="z-swiper__list-wrapper"
         ref="swiperBody"
         @touchstart="touchstart"
         @touchmove="touchmove"
         @touchend="touchend"
         @touchcancel="touchcancel">
      <div class="z-swiper__list"
           ref="swiperWrapper"
           :style="{
               width: innerWidth,
               height: innerHeight,
               transform: 'translateX(0px)'
             }">
        <div
            class="z-swiper__item"
            ref="swiperItems"
            :style="{
                       marginRight: spanGap,
                       width: itemWidth,
                       height: '100%',
                    }"
            v-for="(item, index) in doubleList"
            :data-index="index"
            :key="index">
          <slot
              :item="item"
              :index="index"/>
        </div>
      </div>
    </div>

    <div class="z-swiper__btn"
         v-if="useRight"
         @click="slideRight"
         :style="customBtnStyle">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
import throttle from 'lodash.throttle'

const getCssValue = (str) => {
  const matchResult = String(str).match(/[+-]?(0|([1-9]\d*))(\.\d+)?/)
  return matchResult === null ? Number(str) : Number(matchResult[0])
}

const getCssUnit = (str) => {
  const matchResult = String(str).match(/([a-z]+)/)
  return matchResult === null ? 'px' : matchResult[1]
}

export default {
  name: 'z-swiper',
  props: {
    list: {
      type: Array,
      required: true,
    },
    innerHeight: {
      type: String,
      required: true,
    },
    innerWidth: {
      type: String,
      required: true,
    },
    visibleLength: {
      type: String,
      required: true,
    },
    spanGap: {
      type: String,
      default: 0,
    },
    sideGap: {
      type: String,
      default: 0,
    },
    autoPlay: {
      type: Boolean,
      default: false,
    },
    step: {
      type: Number,
      default: -0.5,
    },
    playDelay: {
      type: Number,
      default: 2000,
    },
    slideAnimationDuration: {
      type: Number,
      default: 300,
    },
  },
  data() {
    return {
      halfLen: 0,
      leftBorder: 0,
      rightBorder: 0,
      itemWidth: this.computeItemWidth(),
      itemFullWidth: 0,
      lastX: 0,
      intersectionRatioThreshold: 0.95,
      replayTimer: null,
      animationInterval: null,
      doubleList: [],
    }
  },
  computed: {
    customBtnStyle() {
      return {
        padding: `0 ${ this.sideGap }`
      }
    },
    useLeft() {
      return this.$slots['left'];
    },
    useRight() {
      return this.$slots['right'];
    },
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
    getDomTranslateX() {
      // TODO 封装获取样式方法
      return Number(this.$refs.swiperWrapper.style.transform.split('(')[1].split('px')[0]);
    },
    setDomTranslateX(translateX) {
      this.$refs.swiperWrapper.style.transform = `translateX(${ translateX }px)`;
    },
    initDoubleList() {
      const mid = Math.floor((this.list.length / 2));
      this.halfLen = mid;
      this.doubleList = [ ...this.list.slice(mid), ...this.list, ...this.list.slice(0, mid) ]
    },
    computeItemWidth() {
      const innerWidthCssUnit = getCssUnit(this.innerWidth);
      const spanGapCssUnit = getCssUnit(this.spanGap);

      if (innerWidthCssUnit !== spanGapCssUnit) {
        throw new Error('Please unite spanGap、innerWidth css unit');
      }

      const innerWidthValue = getCssValue(this.innerWidth);
      console.log('innerWidthValue', innerWidthValue);
      const spanGapValue = getCssValue(this.spanGap);

      const itemWidthValue = (innerWidthValue - (spanGapValue * (this.visibleLength - 1))) / this.visibleLength;

      return itemWidthValue + innerWidthCssUnit;
    },
    initItemFullWidth() {
      const itemDom = this.$refs.swiperItems[0];
      const itemWidth = Number(window.getComputedStyle(itemDom).getPropertyValue('width').replace('px', ''));

      // clientWidth 算出来宽度的数会有一点偏差，用 window.getComputedStyle 最精确
      const renderedSpanGap = Number(window.getComputedStyle(itemDom).getPropertyValue('margin-right').replace('px', ''));
      this.itemFullWidth = itemWidth + renderedSpanGap;
    },
    initTranslateX() {
      const translateX = this.getDomTranslateX() - this.itemFullWidth * this.halfLen;
      this.setDomTranslateX(translateX);

      return Math.abs(translateX);
    },
    play() {
      this.translateX = this.getDomTranslateX();

      const animationCallback = () => {
        this.setMove(this.step);
        this.animationInterval = requestAnimationFrame(animationCallback);
      }

      this.animationInterval = requestAnimationFrame(animationCallback);
    },
    replay() {
      clearTimeout(this.replayTimer);

      this.replayTimer = setTimeout(() => {
        this.play();
      }, this.playDelay);
    },
    // TODO setMove、_slideLeft、_slideRight 逻辑复用
    setMove(xDiff) {
      this.translateX += xDiff;
      const translateXOpt = Math.abs(this.translateX);

      if (translateXOpt >= this.rightBorder) {
        this.translateX = -(this.leftBorder + (translateXOpt - this.rightBorder));
      } else if (translateXOpt <= this.leftBorder) {
        this.translateX = -(this.rightBorder - (this.leftBorder - translateXOpt));
      }

      this.setDomTranslateX(this.translateX);
    },
    async _slideLeft() {
      const entries = await this.getObserveEntries();

      const firstVisibleIndex = entries.findIndex((item) => {
        // 某些浏览器在计算位置时跟预期会有一点点偏差，原来期望完全相交 1 的元素可能相交 0.99，所以将完全相交判定设置比 1 低一点点。
        return item.intersectionRatio >= this.intersectionRatioThreshold;
      });

      const isAllVisible = entries.filter((item) => {
        return item.intersectionRatio >= this.intersectionRatioThreshold
      }).length === this.halfLen;

      const targetIndex = isAllVisible ? firstVisibleIndex + 1 : firstVisibleIndex;
      const target = entries[targetIndex];

      const xDiff = target.boundingClientRect.left - target.rootBounds.left;

      this.translateX -= xDiff;
      const translateXOpt = Math.abs(this.translateX);

      setTimeout(() => {
        if (translateXOpt >= this.rightBorder) {
          // 比如 13 - 8 后得到真实索引 5，视口第一个元素就是索引为 5 的元素
          this.translateX = -(this.itemFullWidth * (targetIndex - this.list.length));
          this.setDomTranslateX(this.translateX);
        }
      }, this.slideAnimationDuration);

      this.setDomTranslateX(this.translateX);
    },
    async _slideRight() {
      const entries = await this.getObserveEntries();

      const lastVisibleIndex = entries.findLastIndex((item) => {
        return item.intersectionRatio >= this.intersectionRatioThreshold;
      });

      const isAllVisible = entries.filter((item) => {
        return item.intersectionRatio >= this.intersectionRatioThreshold;
      }).length === this.halfLen;

      const targetIndex = isAllVisible ? lastVisibleIndex - 1 : lastVisibleIndex;
      const target = entries[targetIndex];

      const xDiff = target.rootBounds.right - target.boundingClientRect.right;

      this.translateX += xDiff;
      const translateXOpt = Math.abs(this.translateX);

      setTimeout(() => {
        if (translateXOpt <= this.leftBorder) {
          // targetIndex - this.halfLen 拿到前置位的索引，也就是将 targetIndex - this.halfLen 放到左边界的位置，此时 targetIndex 刚好在右边界
          this.translateX = -(this.itemFullWidth * (targetIndex - this.halfLen + 1 + this.list.length));
          this.setDomTranslateX(this.translateX);
        }
      }, this.slideAnimationDuration);

      this.setDomTranslateX(this.translateX);
    },
    /*
     * event handle
     */
    slideLeft() {
      this.handleSlide(true);
    },
    slideRight() {
      this.handleSlide();
    },
    touchstart(evt) {
      // 兼容某些安卓手机只触发一次 touchmove 的问题
      // https://blog.csdn.net/cdnight/article/details/50625391
      evt.preventDefault();
      cancelAnimationFrame(this.animationInterval);

      const touch = evt.targetTouches[0];

      this.lastX = touch.pageX;
      this.translateX = this.getDomTranslateX();
    },
    touchmove(evt) {
      // 修复某些安卓手机左滑时页面后退的问题
      // https://www.cnblogs.com/Miracle-ZLZ/p/7852421.html
      evt.preventDefault();

      const touch = evt.targetTouches[0];
      const xDiff = touch.pageX - this.lastX;

      this.lastX = touch.pageX;
      this.setMove(xDiff);
    },
    touchend() {
      if (this.autoPlay) {
        this.replay();
      }
    },
    touchcancel() {
      // 兼容小米手机不触发 touchend 问题
      this.touchend();
    },
  },
  created() {
    this.initDoubleList();
  },
  mounted() {
    this.initItemFullWidth();
    const initialTranslateX = this.initTranslateX();
    this.leftBorder = initialTranslateX;
    this.rightBorder = this.itemFullWidth * this.list.length + initialTranslateX;

    if (this.autoPlay) {
      this.replay();
    }

    this.handleSlide = throttle((isLeft) => {
      cancelAnimationFrame(this.animationInterval);

      Object.assign(this.$refs.swiperWrapper.style, {
        'transition-duration': `${ this.slideAnimationDuration }ms`,
      });

      this.translateX = this.getDomTranslateX();

      if (isLeft) {
        this._slideLeft();
      } else {
        this._slideRight();
      }

      setTimeout(() => {
        Object.assign(this.$refs.swiperWrapper.style, {
          'transition-duration': '0ms',
        });

        if (this.autoPlay) {
          this.replay();
        }
      }, this.slideAnimationDuration);

    }, this.slideAnimationDuration + 300, {
      trailing: false,
    });
  },
};
</script>

<style lang="scss" scoped>
@import '../assets/styles/common';

.z-swiper {
  position: relative;
  user-select: none;
  @include flex-center(row, null, null);

  &__list-wrapper {
    overflow: hidden;
  }

  &__list {
    width: 100%;
    @include flex-center(row, null, null);
  }

  &__item {
    flex-shrink: 0;
  }

  &__btn {
    @include flex-center(row, null, center);
  }
}
</style>
