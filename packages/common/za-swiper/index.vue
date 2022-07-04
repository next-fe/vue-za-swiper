<template>
  <div :class="containerClasses">
    <div class="za-swiper__btn"
         v-if="useLeft"
         @click="slidePrev"
         :style="customBtnStyle">
      <slot name="left"/>
    </div>

    <div class="za-swiper__list-wrapper"
         ref="swiperBody"
         @touchstart="touchstart"
         @touchmove="touchmove"
         @touchend="touchend"
         @touchcancel="touchcancel">
      <div class="za-swiper__list"
           ref="swiperWrapper"
           :style="{
             width: computedInnerWidth,
             height: computedInnerHeight,
             transform: 'translate(0px, 0px)'
           }">
        <div
          class="za-swiper__item"
          ref="swiperItems"
          :style="swiperItemStyle"
          v-for="(item, index) in doubleList"
          :data-index="index"
          :key="index">
          <slot
            :item="item"
            :index="index"/>
        </div>
      </div>
    </div>

    <div class="za-swiper__btn"
         v-if="useRight"
         @click="slideNext"
         :style="customBtnStyle">
      <slot name="right"/>
    </div>
  </div>
</template>

<script>
import _ from '../utils/lodash'
import Utils from '../utils'

const itemSizeModeEnum = {
  COMPUTED: 'computed',
  CUSTOM: 'custom',
}

const directionEnum = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
}

export default {
  name: 'za-swiper',
  props: {
    direction: {
      type: String,
      default: directionEnum.HORIZONTAL
    },
    itemSizeMode: {
      type: String,
      default: itemSizeModeEnum.COMPUTED
    },
    list: {
      type: Array,
      required: true,
    },
    initialOffset: {
      type: [ Number, String ],
      default: 0,
    },
    visibleLength: {
      type: Number,
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
      listDiv: 0,
      leftBorder: 0,
      rightBorder: 0,
      itemWidth: 'auto',
      itemHeight: 'auto',
      itemFullDirectionLengthValue: 0,
      lastOffset: 0,
      intersectionRatioThreshold: 0.95,
      replayTimer: null,
      animationInterval: null,
      doubleList: [],
      playing: false,
    }
  },
  computed: {
    computedInnerWidth() {
      return _.isNumber(this.innerWidth) ? `${ this.innerWidth }px` : this.innerWidth
    },
    computedInnerHeight() {
      return _.isNumber(this.innerHeight) ? `${ this.innerHeight }px` : this.innerHeight
    },
    computedSpanGap() {
      return _.isNumber(this.spanGap) ? `${ this.spanGap }px` : this.spanGap
    },
    computedSideGap() {
      return _.isNumber(this.sideGap) ? `${ this.sideGap }px` : this.sideGap
    },
    customBtnStyle() {
      return {
        padding: `0 ${ this.computedSideGap }`,
      }
    },
    containerClasses() {
      const result = ['za-swiper']
      if (this.direction === directionEnum.VERTICAL) {
        result.push('za-swiper--vertical')
      }

      return result;
    },
    swiperItemStyle() {
      const result = {
        width: this.itemWidth,
        height: this.itemHeight,
        marginRight: 0,
        marginBottom: 0,
      }

      if (this.direction === directionEnum.HORIZONTAL) {
        result.marginRight = this.computedSpanGap
      } else {
        result.marginBottom = this.computedSpanGap
      }

      return result;
    },
    useLeft() {
      return this.$slots.left
    },
    useRight() {
      return this.$slots.right
    },
  },
  methods: {
    getObserveEntries() {
      return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
          observer.disconnect()

          resolve(entries)
        }, {
          root: this.$refs.swiperBody,
        })

        this.$refs.swiperItems.forEach((el) => {
          observer.observe(el)
        })
      })
    },
    getDomDirectionTranslate() {
      const [ , translateX, translateY ] =  /translate\(([^p]+)px, ([^p]+)px\)/.exec(this.$refs.swiperWrapper.style.transform)

      return Number(this.direction === directionEnum.HORIZONTAL ? translateX : translateY)
    },
    setDomDirectionTranslate(value) {
      let translateX = 0
      let translateY = 0

      if (this.direction === directionEnum.HORIZONTAL) {
        translateX = value
      } else {
        translateY = value
      }

      this.$refs.swiperWrapper.style.transform = `translate(${ translateX }px, ${ translateY }px)`;
    },
    initDoubleList() {
      const mid = Math.floor((this.list.length / 2))
      this.doubleList = [ ...this.list.slice(mid), ...this.list, ...this.list.slice(0, mid) ]
      this.listDiv = this.list.length - mid
    },
    initItemCss() {
      const innerLengthCssUnit = Utils.getCssUnit(this.computedInnerWidth)
      const spanGapCssUnit = Utils.getCssUnit(this.computedSpanGap)

      if (innerLengthCssUnit !== spanGapCssUnit) {
        throw new Error('Please unite spanGap、innerWidth css unit')
      }

      const computedDirectionCss = this.direction === directionEnum.HORIZONTAL ? this.computedInnerWidth : this.computedInnerHeight
      const innerDirectionCssValue = Utils.getCssValue(computedDirectionCss)
      const spanGapValue = Utils.getCssValue(this.computedSpanGap)
      const itemDirectionValue = (innerDirectionCssValue - (spanGapValue * (this.visibleLength - 1))) / this.visibleLength

      if (this.direction === directionEnum.HORIZONTAL) {
        this.itemWidth = itemDirectionValue + innerLengthCssUnit
        this.itemHeight = '100%'
      } else {
        this.itemWidth = '100%'
        this.itemHeight = itemDirectionValue + innerLengthCssUnit
      }
    },
    initItemRenderedValue() {
      const itemDom = this.$refs.swiperItems[0]
      let lengthCssProperty = 'width'
      let gapCssProperty = 'margin-right'

      if (this.direction === directionEnum.VERTICAL) {
        lengthCssProperty = 'height'
        gapCssProperty = 'margin-bottom'
      }

      // clientWidth或clientHeight 算出来宽度的值会有一点偏差，getComputedStyle 最精确
      this.itemFullDirectionLengthValue = Utils.getDomPropertyValue(itemDom, lengthCssProperty) + Utils.getDomPropertyValue(itemDom, gapCssProperty);
    },
    initTranslate() {
      const translate = this.getDomDirectionTranslate() - this.itemFullDirectionLengthValue * this.listDiv
      this.setDomDirectionTranslate(translate)

      return Math.abs(translate)
    },
    play() {
      this.translate = this.getDomDirectionTranslate()

      const animationCallback = () => {
        this.setMove(this.step)
        this.animationInterval = requestAnimationFrame(animationCallback)
      }

      this.animationInterval = requestAnimationFrame(animationCallback)
    },
    replay() {
      clearTimeout(this.replayTimer)

      this.replayTimer = setTimeout(() => {
        if (this.playing) {
          return
        }

        this.play()
      }, this.playDelay)
    },
    setMove(diff) {
      this.translate += diff
      const translateAbs = Math.abs(this.translate)

      if (translateAbs >= this.rightBorder) {
        this.translate = -(this.leftBorder + (translateAbs - this.rightBorder))
      } else if (translateAbs <= this.leftBorder) {
        this.translate = -(this.rightBorder - (this.leftBorder - translateAbs))
      }

      this.setDomDirectionTranslate(this.translate)
    },
    _slidePrev() {
      this.getObserveEntries().then(((entries) => {
        const lastVisibleIndex = entries.findLastIndex((item) => item.intersectionRatio >= this.intersectionRatioThreshold)

        const isAllVisible = entries
          .filter((item) => item.intersectionRatio >= this.intersectionRatioThreshold).length === this.visibleLength

        const targetIndex = isAllVisible ? lastVisibleIndex - 1 : lastVisibleIndex
        const target = entries[targetIndex]

        const diff = target.rootBounds.right - target.boundingClientRect.right
        this.translate += diff
        this.setDomDirectionTranslate(this.translate)

        const translateAbs = Math.abs(this.translate)
        setTimeout(() => {
          if (translateAbs <= this.leftBorder) {
            this.translate = -(this.itemFullDirectionLengthValue * (targetIndex - this.visibleLength + 1 + this.list.length))
            this.setDomDirectionTranslate(this.translate)
          }
        }, this.slideAnimationDuration)
      }))
    },
    _slideNext() {
      this.getObserveEntries().then((entries) => {
        const firstVisibleIndex = entries.findIndex((item) => item.intersectionRatio >= this.intersectionRatioThreshold)
        // 某些浏览器在计算位置时跟预期会有一点点偏差，原来期望完全相交 1 的元素可能相交 0.99，所以将完全相交判定设置比 1 低一点点。

        const isAllVisible = entries
          .filter((item) => item.intersectionRatio >= this.intersectionRatioThreshold).length === this.visibleLength

        const targetIndex = isAllVisible ? firstVisibleIndex + 1 : firstVisibleIndex
        const target = entries[targetIndex]

        const diff = target.boundingClientRect.left - target.rootBounds.left
        this.translate -= diff
        this.setDomDirectionTranslate(this.translate)

        const translateXAbs = Math.abs(this.translate)
        setTimeout(() => {
          if (translateXAbs >= this.rightBorder) {
            this.translate = -(this.itemFullDirectionLengthValue * (targetIndex - this.list.length))
            this.setDomDirectionTranslate(this.translate)
          }
        }, this.slideAnimationDuration)
      });
    },
    initOffset() {
      let widthValue = 0

      if (_.isNumber(this.initialOffset)) {
        widthValue = this.initialOffset
      } else {
        const unit = Utils.getCssUnit(this.initialOffset)

        if (unit === 'px') {
          widthValue = Utils.getCssValue(this.initialOffset)
        } else {
          // 将其他单位转成 px
          const dom = document.createElement('div');
          dom.setAttribute('style', `width: ${ this.initialOffset }; position: fixed; top: 9999px`)
          document.body.appendChild(dom)
          widthValue = Utils.getDomPropertyValue(dom, 'width');
          document.body.removeChild(dom)
        }
      }

      this.translate = this.getDomDirectionTranslate()
      this.setMove(widthValue)
    },
    /*
     * event handle
     */
    slidePrev() {
      if (this.direction ===  directionEnum.VERTICAL || this.itemSizeMode !== itemSizeModeEnum.COMPUTED) {
        throw new Error('仅当 direction 为 horizontal 且 item-width-mode 为 computed 时才能使用按钮滑动功能')
      }
      this.handleSlide(true);
    },
    slideNext() {
      if (this.direction ===  directionEnum.VERTICAL || this.itemSizeMode !== itemSizeModeEnum.COMPUTED) {
        throw new Error('仅当 direction 为 horizontal 且 item-width-mode 为 computed 时才能使用按钮滑动功能')
      }
      this.handleSlide()
    },
    touchstart(evt) {
      this.playing = true
      // 兼容某些安卓手机（如小米）只触发一次 touchmove 的问题
      // TODO 待测试：使用 evt.preventDefault 之后会影响 item 点击，暂时替换 evt.stopPropagation 试试
      // https://blog.csdn.net/cdnight/article/details/50625391
      // evt.stopPropagation()

      cancelAnimationFrame(this.animationInterval)

      this.lastOffset = this.direction === directionEnum.HORIZONTAL ? evt.targetTouches[0].pageX : evt.targetTouches[0].pageY
      this.translate = this.getDomDirectionTranslate()
    },
    touchmove(evt) {
      // 修复某些安卓手机（如 OPPO）左滑时页面后退的问题
      // https://www.cnblogs.com/Miracle-ZLZ/p/7852421.html
      // evt.preventDefault() 虽然能解决问题，但是会导致在 swiper 区域上下滑动时视图不滑动。目前 touch-action 能完美解决

      const touchPageValue = this.direction === directionEnum.HORIZONTAL ? evt.targetTouches[0].pageX : evt.targetTouches[0].pageY
      const diff = touchPageValue - this.lastOffset

      this.lastOffset = touchPageValue
      this.setMove(diff)
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
    if (this.itemSizeMode === itemSizeModeEnum.COMPUTED) {
      if (!this.visibleLength) {
        throw new Error('visibleLength 必须为大于 0 的整数')
      }

      this.initItemCss()
    }

    this.initDoubleList()
  },
  mounted() {
    this.initItemRenderedValue()
    const initialTranslate = this.initTranslate()
    this.leftBorder = initialTranslate
    this.rightBorder = this.itemFullDirectionLengthValue * this.list.length + initialTranslate

    if (this.initialOffset) {
      this.initOffset()
    }

    if (this.autoPlay) {
      if (this.playImmediate) {
        this.play()
        return
      }

      this.replay()
    }

    // 使用 throttle 避免用户快速连续点击导致动画出问题
    this.handleSlide = _.throttle((isPrev) => {
      cancelAnimationFrame(this.animationInterval)

      Object.assign(this.$refs.swiperWrapper.style, {
        'transition-duration': `${ this.slideAnimationDuration }ms`,
      })

      this.translate = this.getDomDirectionTranslate()

      if (isPrev) {
        this._slidePrev()
      } else {
        this._slideNext()
      }

      setTimeout(() => {
        Object.assign(this.$refs.swiperWrapper.style, {
          'transition-duration': '0ms',
        })

        if (this.autoPlay) {
          this.replay()
        }
      }, this.slideAnimationDuration)
    }, this.slideAnimationDuration + 200, {
      trailing: false,
    })
  },
  beforeDestroy() {
    clearTimeout(this.replayTimer)
    cancelAnimationFrame(this.animationInterval)
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/common';

.za-swiper {
  position: relative;
  user-select: none;
  @include flex-center(row, null, null);
  touch-action: pan-y;

  &__list-wrapper {
    overflow: hidden;
  }

  &__list {
    @include flex-center(row, null, null);
  }

  &__item {
    flex-shrink: 0;
    overflow: hidden;
  }

  &__btn {
    @include flex-center(row, null, center);
  }

  &--vertical {
    touch-action: pan-x;
    .za-swiper__list {
      @include flex-center(column, null, null);
    }
  }
}
</style>
