import { openBlock, createElementBlock, normalizeStyle, renderSlot, createCommentVNode, createElementVNode, Fragment, renderList } from "vue";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var FUNC_ERROR_TEXT = "Expected a function";
var NAN = 0 / 0;
var symbolTag = "[object Symbol]";
var reTrim = /^\s+|\s+$/g;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root = freeGlobal || freeSelf || Function("return this")();
var objectProto = Object.prototype;
var objectToString = objectProto.toString;
var nativeMax = Math.max, nativeMin = Math.min;
var now = function() {
  return root.Date.now();
};
function debounce(func, wait, options) {
  var lastArgs, lastThis, maxWait, result, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = "maxWait" in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  function invokeFunc(time) {
    var args = lastArgs, thisArg = lastThis;
    lastArgs = lastThis = void 0;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }
  function leadingEdge(time) {
    lastInvokeTime = time;
    timerId = setTimeout(timerExpired, wait);
    return leading ? invokeFunc(time) : result;
  }
  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, result2 = wait - timeSinceLastCall;
    return maxing ? nativeMin(result2, maxWait - timeSinceLastInvoke) : result2;
  }
  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
    return lastCallTime === void 0 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
  }
  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    timerId = setTimeout(timerExpired, remainingWait(time));
  }
  function trailingEdge(time) {
    timerId = void 0;
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = void 0;
    return result;
  }
  function cancel() {
    if (timerId !== void 0) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = void 0;
  }
  function flush() {
    return timerId === void 0 ? result : trailingEdge(now());
  }
  function debounced() {
    var time = now(), isInvoking = shouldInvoke(time);
    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;
    if (isInvoking) {
      if (timerId === void 0) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === void 0) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}
function throttle(func, wait, options) {
  var leading = true, trailing = true;
  if (typeof func != "function") {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  if (isObject(options)) {
    leading = "leading" in options ? !!options.leading : leading;
    trailing = "trailing" in options ? !!options.trailing : trailing;
  }
  return debounce(func, wait, {
    "leading": leading,
    "maxWait": wait,
    "trailing": trailing
  });
}
function isObject(value) {
  var type = typeof value;
  return !!value && (type == "object" || type == "function");
}
function isObjectLike(value) {
  return !!value && typeof value == "object";
}
function isSymbol(value) {
  return typeof value == "symbol" || isObjectLike(value) && objectToString.call(value) == symbolTag;
}
function toNumber(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == "function" ? value.valueOf() : value;
    value = isObject(other) ? other + "" : other;
  }
  if (typeof value != "string") {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, "");
  var isBinary = reIsBinary.test(value);
  return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
}
var lodash_throttle = throttle;
function isNumber(obj) {
  return typeof obj === "number" && !isNaN(obj);
}
var _ = {
  isNumber,
  throttle: lodash_throttle
};
var Utils = {
  getCssValue(str) {
    const matchResult = String(str).match(/[+-]?(0|([1-9]\d*))(\.\d+)?/);
    return Number(matchResult[0]);
  },
  getCssUnit(str) {
    const matchResult = String(str).match(/([a-z]+)/);
    return matchResult[1];
  },
  getDomPropertyValue(dom, property) {
    return Number(window.getComputedStyle(dom).getPropertyValue(property).replace("px", ""));
  }
};
var index_vue_vue_type_style_index_0_scoped_true_lang = "";
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const itemWidthModeEnum = {
  COMPUTED: "computed",
  CUSTOM: "custom"
};
const _sfc_main = {
  name: "za-swiper",
  props: {
    itemWidthMode: {
      type: String,
      default: itemWidthModeEnum.COMPUTED
    },
    list: {
      type: Array,
      required: true
    },
    initialOffset: {
      type: [Number, String],
      default: 0
    },
    visibleLength: {
      type: Number
    },
    innerHeight: {
      type: [Number, String],
      required: true
    },
    innerWidth: {
      type: [Number, String],
      required: true
    },
    spanGap: {
      type: [Number, String],
      default: 0
    },
    sideGap: {
      type: [Number, String],
      default: 0
    },
    autoPlay: {
      type: Boolean,
      default: false
    },
    step: {
      type: Number,
      default: -0.5
    },
    playDelay: {
      type: Number,
      default: 2e3
    },
    playImmediate: {
      type: Boolean,
      default: false
    },
    slideAnimationDuration: {
      type: Number,
      default: 300
    }
  },
  data() {
    return {
      listDiv: 0,
      leftBorder: 0,
      rightBorder: 0,
      itemWidth: "auto",
      itemWidthValue: 0,
      itemFullWidthValue: 0,
      lastX: 0,
      intersectionRatioThreshold: 0.95,
      replayTimer: null,
      animationInterval: null,
      doubleList: [],
      playing: false
    };
  },
  computed: {
    computedInnerWidth() {
      return _.isNumber(this.innerWidth) ? `${this.innerWidth}px` : this.innerWidth;
    },
    computedInnerHeight() {
      return _.isNumber(this.innerHeight) ? `${this.innerHeight}px` : this.innerHeight;
    },
    computedSpanGap() {
      return _.isNumber(this.spanGap) ? `${this.spanGap}px` : this.spanGap;
    },
    computedSideGap() {
      return _.isNumber(this.sideGap) ? `${this.sideGap}px` : this.sideGap;
    },
    customBtnStyle() {
      return {
        padding: `0 ${this.computedSideGap}`
      };
    },
    useLeft() {
      return this.$slots.left;
    },
    useRight() {
      return this.$slots.right;
    }
  },
  methods: {
    getObserveEntries() {
      return new Promise((resolve) => {
        const observer = new IntersectionObserver((entries) => {
          observer.disconnect();
          resolve(entries);
        }, {
          root: this.$refs.swiperBody
        });
        this.$refs.swiperItems.forEach((el) => {
          observer.observe(el);
        });
      });
    },
    getDomTranslateX() {
      return Number(this.$refs.swiperWrapper.style.transform.split("(")[1].split("px")[0]);
    },
    setDomTranslateX(translateX) {
      this.$refs.swiperWrapper.style.transform = `translateX(${translateX}px)`;
    },
    initDoubleList() {
      const mid = Math.floor(this.list.length / 2);
      this.doubleList = [...this.list.slice(mid), ...this.list, ...this.list.slice(0, mid)];
      this.listDiv = this.list.length - mid;
    },
    initItemWidth() {
      const innerWidthCssUnit = Utils.getCssUnit(this.computedInnerWidth);
      const spanGapCssUnit = Utils.getCssUnit(this.computedSpanGap);
      if (innerWidthCssUnit !== spanGapCssUnit) {
        throw new Error("Please unite spanGap\u3001innerWidth css unit");
      }
      const innerWidthValue = Utils.getCssValue(this.computedInnerWidth);
      const spanGapValue = Utils.getCssValue(this.computedSpanGap);
      const itemWidthValue = (innerWidthValue - spanGapValue * (this.visibleLength - 1)) / this.visibleLength;
      this.itemWidth = itemWidthValue + innerWidthCssUnit;
    },
    initItemWidthValue() {
      const itemDom = this.$refs.swiperItems[0];
      this.itemWidthValue = Utils.getDomPropertyValue(itemDom, "width");
      this.itemFullWidthValue = this.itemWidthValue + Utils.getDomPropertyValue(itemDom, "margin-right");
    },
    initTranslateX() {
      const translateX = this.getDomTranslateX() - this.itemFullWidthValue * this.listDiv;
      this.setDomTranslateX(translateX);
      return Math.abs(translateX);
    },
    play() {
      this.translateX = this.getDomTranslateX();
      const animationCallback = () => {
        this.setMove(this.step);
        this.animationInterval = requestAnimationFrame(animationCallback);
      };
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
    _slidePrev() {
      this.getObserveEntries().then((entries) => {
        const lastVisibleIndex = entries.findLastIndex((item) => item.intersectionRatio >= this.intersectionRatioThreshold);
        const isAllVisible = entries.filter((item) => item.intersectionRatio >= this.intersectionRatioThreshold).length === this.visibleLength;
        const targetIndex = isAllVisible ? lastVisibleIndex - 1 : lastVisibleIndex;
        const target = entries[targetIndex];
        const xDiff = target.rootBounds.right - target.boundingClientRect.right;
        this.translateX += xDiff;
        this.setDomTranslateX(this.translateX);
        const translateXAbs = Math.abs(this.translateX);
        setTimeout(() => {
          if (translateXAbs <= this.leftBorder) {
            this.translateX = -(this.itemFullWidthValue * (targetIndex - this.visibleLength + 1 + this.list.length));
            this.setDomTranslateX(this.translateX);
          }
        }, this.slideAnimationDuration);
      });
    },
    _slideNext() {
      this.getObserveEntries().then((entries) => {
        const firstVisibleIndex = entries.findIndex((item) => item.intersectionRatio >= this.intersectionRatioThreshold);
        const isAllVisible = entries.filter((item) => item.intersectionRatio >= this.intersectionRatioThreshold).length === this.visibleLength;
        const targetIndex = isAllVisible ? firstVisibleIndex + 1 : firstVisibleIndex;
        const target = entries[targetIndex];
        const xDiff = target.boundingClientRect.left - target.rootBounds.left;
        this.translateX -= xDiff;
        this.setDomTranslateX(this.translateX);
        const translateXAbs = Math.abs(this.translateX);
        setTimeout(() => {
          if (translateXAbs >= this.rightBorder) {
            this.translateX = -(this.itemFullWidthValue * (targetIndex - this.list.length));
            this.setDomTranslateX(this.translateX);
          }
        }, this.slideAnimationDuration);
      });
    },
    initOffset() {
      let widthValue = 0;
      if (_.isNumber(this.initialOffset)) {
        widthValue = this.initialOffset;
      } else {
        const unit = Utils.getCssUnit(this.initialOffset);
        if (unit === "px") {
          widthValue = Utils.getCssValue(this.initialOffset);
        } else {
          const dom = document.createElement("div");
          dom.setAttribute("style", `width: ${this.initialOffset}; position: fixed; top: 9999px`);
          document.body.appendChild(dom);
          widthValue = Utils.getDomPropertyValue(dom, "width");
          document.body.removeChild(dom);
        }
      }
      this.translateX = this.getDomTranslateX();
      this.setMove(widthValue);
    },
    slidePrev() {
      if (this.itemWidthMode !== itemWidthModeEnum.COMPUTED) {
        throw new Error("\u4EC5 computed-item-width \u6A21\u5F0F\u652F\u6301 slidePrev");
      }
      this.handleSlide(true);
    },
    slideNext() {
      if (this.itemWidthMode !== itemWidthModeEnum.COMPUTED) {
        throw new Error("\u4EC5 computed-item-width \u6A21\u5F0F\u652F\u6301 slideNext");
      }
      this.handleSlide();
    },
    touchstart(evt) {
      this.playing = true;
      cancelAnimationFrame(this.animationInterval);
      const touch = evt.targetTouches[0];
      this.lastX = touch.pageX;
      this.translateX = this.getDomTranslateX();
    },
    touchmove(evt) {
      const touch = evt.targetTouches[0];
      const xDiff = touch.pageX - this.lastX;
      this.lastX = touch.pageX;
      this.setMove(xDiff);
    },
    touchend() {
      this.playing = false;
      if (this.autoPlay) {
        this.replay();
      }
    },
    touchcancel() {
      this.touchend();
    }
  },
  created() {
    if (this.itemWidthMode === itemWidthModeEnum.COMPUTED) {
      if (!this.visibleLength) {
        throw new Error("visibleLength \u5FC5\u987B\u4E3A\u5927\u4E8E 0 \u7684\u6574\u6570");
      }
      this.initItemWidth();
    }
    this.initDoubleList();
  },
  mounted() {
    this.initItemWidthValue();
    const initialTranslateX = this.initTranslateX();
    this.leftBorder = initialTranslateX;
    this.rightBorder = this.itemFullWidthValue * this.list.length + initialTranslateX;
    if (this.initialOffset) {
      this.initOffset();
    }
    if (this.autoPlay) {
      if (this.playImmediate) {
        this.play();
        return;
      }
      this.replay();
    }
    this.handleSlide = _.throttle((isPrev) => {
      cancelAnimationFrame(this.animationInterval);
      Object.assign(this.$refs.swiperWrapper.style, {
        "transition-duration": `${this.slideAnimationDuration}ms`
      });
      this.translateX = this.getDomTranslateX();
      if (isPrev) {
        this._slidePrev();
      } else {
        this._slideNext();
      }
      setTimeout(() => {
        Object.assign(this.$refs.swiperWrapper.style, {
          "transition-duration": "0ms"
        });
        if (this.autoPlay) {
          this.replay();
        }
      }, this.slideAnimationDuration);
    }, this.slideAnimationDuration + 200, {
      trailing: false
    });
  },
  beforeDestroy() {
    clearTimeout(this.replayTimer);
    cancelAnimationFrame(this.animationInterval);
  }
};
const _hoisted_1 = { class: "za-swiper" };
const _hoisted_2 = ["data-index"];
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1, [
    $options.useLeft ? (openBlock(), createElementBlock("div", {
      key: 0,
      class: "za-swiper__btn",
      onClick: _cache[0] || (_cache[0] = (...args) => $options.slidePrev && $options.slidePrev(...args)),
      style: normalizeStyle($options.customBtnStyle)
    }, [
      renderSlot(_ctx.$slots, "left", {}, void 0, true)
    ], 4)) : createCommentVNode("", true),
    createElementVNode("div", {
      class: "za-swiper__list-wrapper",
      ref: "swiperBody",
      onTouchstart: _cache[1] || (_cache[1] = (...args) => $options.touchstart && $options.touchstart(...args)),
      onTouchmove: _cache[2] || (_cache[2] = (...args) => $options.touchmove && $options.touchmove(...args)),
      onTouchend: _cache[3] || (_cache[3] = (...args) => $options.touchend && $options.touchend(...args)),
      onTouchcancel: _cache[4] || (_cache[4] = (...args) => $options.touchcancel && $options.touchcancel(...args))
    }, [
      createElementVNode("div", {
        class: "za-swiper__list",
        ref: "swiperWrapper",
        style: normalizeStyle({
          width: $options.computedInnerWidth,
          height: $options.computedInnerHeight,
          transform: "translateX(0px)"
        })
      }, [
        (openBlock(true), createElementBlock(Fragment, null, renderList($data.doubleList, (item, index) => {
          return openBlock(), createElementBlock("div", {
            class: "za-swiper__item",
            ref_for: true,
            ref: "swiperItems",
            style: normalizeStyle({
              marginRight: $options.computedSpanGap,
              width: $data.itemWidth,
              height: "100%"
            }),
            "data-index": index,
            key: index
          }, [
            renderSlot(_ctx.$slots, "default", {
              item,
              index
            }, void 0, true)
          ], 12, _hoisted_2);
        }), 128))
      ], 4)
    ], 544),
    $options.useRight ? (openBlock(), createElementBlock("div", {
      key: 1,
      class: "za-swiper__btn",
      onClick: _cache[5] || (_cache[5] = (...args) => $options.slideNext && $options.slideNext(...args)),
      style: normalizeStyle($options.customBtnStyle)
    }, [
      renderSlot(_ctx.$slots, "right", {}, void 0, true)
    ], 4)) : createCommentVNode("", true)
  ]);
}
var ZASwiper = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-82881cae"]]);
export { ZASwiper as default };
