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
               width: computedInnerWidth,
               height: computedInnerHeight,
               transform: 'translateX(0px)'
             }">
        <div
            class="z-swiper__item"
            ref="swiperItems"
            :style="{
                       marginRight: computedSpanGap,
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
import _ from '../utils/lodash'
import Utils from '../utils/index'

export default {
  name: 'z-swiper',
  props: {
    list: {
      type: Array,
      required: true,
    },
    innerHeight: {
      type: [ Number, String ],
      required: true,
    },
    innerWidth: {
      type: [ Number, String ],
      required: true,
    },
    spanGap: {
      type: [ Number, String ],
      default: 0,
    },
    sideGap: {
      type: [ Number, String ],
      default: 0,
    },
    visibleLength: {
      type: Number,
      required: true,
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
    playImmediate: {
      type: Boolean,
      default: false,
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
      itemWidth: 0,
      itemFullWidth: 0,
      lastX: 0,
      intersectionRatioThreshold: 0.95,
      replayTimer: null,
      animationInterval: null,
      doubleList: [],
      playing: false,
    }
  },
  computed: {
    computedInnerWidth() {
      return _.isNumber(this.innerWidth) ? `${ this.innerWidth }px` : this.innerWidth;
    },
    computedInnerHeight() {
      return _.isNumber(this.innerHeight) ? `${ this.innerHeight }px` : this.innerHeight;
    },
    computedSpanGap() {
      return _.isNumber(this.spanGap) ? `${ this.spanGap }px` : this.spanGap;
    },
    computedSideGap() {
      return _.isNumber(this.sideGap) ? `${ this.sideGap }px` : this.sideGap;
    },
    customBtnStyle() {
      return {
        padding: `0 ${ this.computedSideGap }`
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
    initItemWidth() {
      const innerWidthCssUnit = Utils.getCssUnit(this.computedInnerWidth);
      const spanGapCssUnit = Utils.getCssUnit(this.computedSpanGap);

      if (innerWidthCssUnit !== spanGapCssUnit) {
        throw new Error('Please unite spanGap、innerWidth css unit');
      }

      const innerWidthValue = Utils.getCssValue(this.computedInnerWidth);
      const spanGapValue = Utils.getCssValue(this.computedSpanGap);

      const itemWidthValue = (innerWidthValue - (spanGapValue * (this.visibleLength - 1))) / this.visibleLength;

      this.itemWidth = itemWidthValue + innerWidthCssUnit;
    },
    initItemFullWidth() {
      const itemDom = this.$refs.swiperItems[0]
      // clientWidth 算出来宽度的数会有一点偏差，用 window.getComputedStyle 最精确
      this.itemFullWidth = Utils.getDomPropertyValue(itemDom,'width') + Utils.getDomPropertyValue(itemDom,'margin-right')
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
        if (this.playing) {
          return;
        }

        this.play();
      }, this.playDelay);
    },
    setMove(xDiff) {
      this.translateX += xDiff;
      const translateXAbs = Math.abs(this.translateX);

      if (translateXAbs >= this.rightBorder) {
        this.translateX = -(this.leftBorder + (translateXAbs - this.rightBorder));
      } else if (translateXAbs <= this.leftBorder) {
        this.translateX = -(this.rightBorder - (this.leftBorder - translateXAbs));
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
      this.setDomTranslateX(this.translateX);

      const translateXAbs = Math.abs(this.translateX);
      setTimeout(() => {
        if (translateXAbs >= this.rightBorder) {
          this.translateX = -(this.itemFullWidth * (targetIndex - this.list.length));
          this.setDomTranslateX(this.translateX);
        }
      }, this.slideAnimationDuration);
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
      this.setDomTranslateX(this.translateX);

      const translateXAbs = Math.abs(this.translateX);
      setTimeout(() => {
        if (translateXAbs <= this.leftBorder) {
          this.translateX = -(this.itemFullWidth * (targetIndex - this.halfLen + 1 + this.list.length));
          this.setDomTranslateX(this.translateX);
        }
      }, this.slideAnimationDuration);
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
      this.playing = true;
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
      evt.preventDefault()

      const touch = evt.targetTouches[0]
      const xDiff = touch.pageX - this.lastX

      this.lastX = touch.pageX
      this.setMove(xDiff)
    },
    touchend() {
      this.playing = false

      if (this.autoPlay) {
        this.replay()
      }
    },
    touchcancel() {
      // 兼容小米手机不触发 touchend 问题
      this.touchend()
    },
  },
  created() {
    this.initItemWidth()
    this.initDoubleList()
  },
  mounted() {
    this.initItemFullWidth()
    const initialTranslateX = this.initTranslateX()
    this.leftBorder = initialTranslateX
    this.rightBorder = this.itemFullWidth * this.list.length + initialTranslateX

    if (this.autoPlay) {
      if (this.playImmediate) {
        this.play()
        return
      }

      this.replay()
    }

    // 使用 throttle 避免用户快速连续点击导致动画出问题
    this.handleSlide = _.throttle((isLeft) => {
      cancelAnimationFrame(this.animationInterval)

      Object.assign(this.$refs.swiperWrapper.style, {
        'transition-duration': `${ this.slideAnimationDuration }ms`,
      })

      this.translateX = this.getDomTranslateX()

      if (isLeft) {
        this._slideLeft()
      } else {
        this._slideRight()
      }

      setTimeout(() => {
        Object.assign(this.$refs.swiperWrapper.style, {
          'transition-duration': '0ms',
        })

        if (this.autoPlay) {
          this.replay()
        }
      }, this.slideAnimationDuration)

    }, this.slideAnimationDuration + 300, {
      trailing: false,
    })
  },
}
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
    overflow: hidden;
  }

  &__btn {
    @include flex-center(row, null, center);
  }
}
</style>
