(function(s,u){typeof exports=="object"&&typeof module!="undefined"?module.exports=u(require("vue")):typeof define=="function"&&define.amd?define(["vue"],u):(s=typeof globalThis!="undefined"?globalThis:s||self,s["z-index"]=u(s.Vue))})(this,function(s){"use strict";var u=typeof globalThis!="undefined"?globalThis:typeof window!="undefined"?window:typeof global!="undefined"?global:typeof self!="undefined"?self:{},D="Expected a function",I=0/0,C="[object Symbol]",E=/^\s+|\s+$/g,_=/^[-+]0x[0-9a-f]+$/i,k=/^0b[01]+$/i,A=/^0o[0-7]+$/i,M=parseInt,P=typeof u=="object"&&u&&u.Object===Object&&u,L=typeof self=="object"&&self&&self.Object===Object&&self,R=P||L||Function("return this")(),G=Object.prototype,j=G.toString,F=Math.max,U=Math.min,X=function(){return R.Date.now()};function z(t,e,i){var o,l,n,r,a,c,p=0,V=!1,g=!1,W=!0;if(typeof t!="function")throw new TypeError(D);e=S(e)||0,b(i)&&(V=!!i.leading,g="maxWait"in i,n=g?F(S(i.maxWait)||0,e):n,W="trailing"in i?!!i.trailing:W);function x(h){var m=o,y=l;return o=l=void 0,p=h,r=t.apply(y,m),r}function st(h){return p=h,a=setTimeout(v,e),V?x(h):r}function nt(h){var m=h-c,y=h-p,O=e-m;return g?U(O,n-y):O}function B(h){var m=h-c,y=h-p;return c===void 0||m>=e||m<0||g&&y>=n}function v(){var h=X();if(B(h))return N(h);a=setTimeout(v,nt(h))}function N(h){return a=void 0,W&&o?x(h):(o=l=void 0,r)}function rt(){a!==void 0&&clearTimeout(a),p=0,o=c=l=a=void 0}function at(){return a===void 0?r:N(X())}function w(){var h=X(),m=B(h);if(o=arguments,l=this,c=h,m){if(a===void 0)return st(c);if(g)return a=setTimeout(v,e),x(c)}return a===void 0&&(a=setTimeout(v,e)),r}return w.cancel=rt,w.flush=at,w}function H(t,e,i){var o=!0,l=!0;if(typeof t!="function")throw new TypeError(D);return b(i)&&(o="leading"in i?!!i.leading:o,l="trailing"in i?!!i.trailing:l),z(t,e,{leading:o,maxWait:e,trailing:l})}function b(t){var e=typeof t;return!!t&&(e=="object"||e=="function")}function $(t){return!!t&&typeof t=="object"}function q(t){return typeof t=="symbol"||$(t)&&j.call(t)==C}function S(t){if(typeof t=="number")return t;if(q(t))return I;if(b(t)){var e=typeof t.valueOf=="function"?t.valueOf():t;t=b(e)?e+"":e}if(typeof t!="string")return t===0?t:+t;t=t.replace(E,"");var i=k.test(t);return i||A.test(t)?M(t.slice(2),i?2:8):_.test(t)?I:+t}var Z=H;function J(t){return typeof t=="number"&&!isNaN(t)}var f={isNumber:J,throttle:Z},d={getCssValue(t){const e=String(t).match(/[+-]?(0|([1-9]\d*))(\.\d+)?/);return Number(e[0])},getCssUnit(t){return String(t).match(/([a-z]+)/)[1]},getDomPropertyValue(t,e){return Number(window.getComputedStyle(t).getPropertyValue(e).replace("px",""))}},lt="",K=(t,e)=>{const i=t.__vccOpts||t;for(const[o,l]of e)i[o]=l;return i};const T={COMPUTED:"computed",CUSTOM:"custom"},Q={name:"za-swiper",props:{itemWidthMode:{type:String,default:T.COMPUTED},list:{type:Array,required:!0},initialOffset:{type:[Number,String],default:0},visibleLength:{type:Number},innerHeight:{type:[Number,String],required:!0},innerWidth:{type:[Number,String],required:!0},spanGap:{type:[Number,String],default:0},sideGap:{type:[Number,String],default:0},autoPlay:{type:Boolean,default:!1},step:{type:Number,default:-.5},playDelay:{type:Number,default:2e3},playImmediate:{type:Boolean,default:!1},slideAnimationDuration:{type:Number,default:300}},data(){return{listDiv:0,leftBorder:0,rightBorder:0,itemWidth:"auto",itemWidthValue:0,itemFullWidthValue:0,lastX:0,intersectionRatioThreshold:.95,replayTimer:null,animationInterval:null,doubleList:[],playing:!1}},computed:{computedInnerWidth(){return f.isNumber(this.innerWidth)?`${this.innerWidth}px`:this.innerWidth},computedInnerHeight(){return f.isNumber(this.innerHeight)?`${this.innerHeight}px`:this.innerHeight},computedSpanGap(){return f.isNumber(this.spanGap)?`${this.spanGap}px`:this.spanGap},computedSideGap(){return f.isNumber(this.sideGap)?`${this.sideGap}px`:this.sideGap},customBtnStyle(){return{padding:`0 ${this.computedSideGap}`}},useLeft(){return this.$slots.left},useRight(){return this.$slots.right}},methods:{getObserveEntries(){return new Promise(t=>{const e=new IntersectionObserver(i=>{e.disconnect(),t(i)},{root:this.$refs.swiperBody});this.$refs.swiperItems.forEach(i=>{e.observe(i)})})},getDomTranslateX(){return Number(this.$refs.swiperWrapper.style.transform.split("(")[1].split("px")[0])},setDomTranslateX(t){this.$refs.swiperWrapper.style.transform=`translateX(${t}px)`},initDoubleList(){const t=Math.floor(this.list.length/2);this.doubleList=[...this.list.slice(t),...this.list,...this.list.slice(0,t)],this.listDiv=this.list.length-t},initItemWidth(){const t=d.getCssUnit(this.computedInnerWidth),e=d.getCssUnit(this.computedSpanGap);if(t!==e)throw new Error("Please unite spanGap\u3001innerWidth css unit");const i=d.getCssValue(this.computedInnerWidth),o=d.getCssValue(this.computedSpanGap),l=(i-o*(this.visibleLength-1))/this.visibleLength;this.itemWidth=l+t},initItemWidthValue(){const t=this.$refs.swiperItems[0];this.itemWidthValue=d.getDomPropertyValue(t,"width"),this.itemFullWidthValue=this.itemWidthValue+d.getDomPropertyValue(t,"margin-right")},initTranslateX(){const t=this.getDomTranslateX()-this.itemFullWidthValue*this.listDiv;return this.setDomTranslateX(t),Math.abs(t)},play(){this.translateX=this.getDomTranslateX();const t=()=>{this.setMove(this.step),this.animationInterval=requestAnimationFrame(t)};this.animationInterval=requestAnimationFrame(t)},replay(){clearTimeout(this.replayTimer),this.replayTimer=setTimeout(()=>{this.playing||this.play()},this.playDelay)},setMove(t){this.translateX+=t;const e=Math.abs(this.translateX);e>=this.rightBorder?this.translateX=-(this.leftBorder+(e-this.rightBorder)):e<=this.leftBorder&&(this.translateX=-(this.rightBorder-(this.leftBorder-e))),this.setDomTranslateX(this.translateX)},_slidePrev(){this.getObserveEntries().then(t=>{const e=t.findLastIndex(a=>a.intersectionRatio>=this.intersectionRatioThreshold),o=t.filter(a=>a.intersectionRatio>=this.intersectionRatioThreshold).length===this.visibleLength?e-1:e,l=t[o],n=l.rootBounds.right-l.boundingClientRect.right;this.translateX+=n,this.setDomTranslateX(this.translateX);const r=Math.abs(this.translateX);setTimeout(()=>{r<=this.leftBorder&&(this.translateX=-(this.itemFullWidthValue*(o-this.visibleLength+1+this.list.length)),this.setDomTranslateX(this.translateX))},this.slideAnimationDuration)})},_slideNext(){this.getObserveEntries().then(t=>{const e=t.findIndex(a=>a.intersectionRatio>=this.intersectionRatioThreshold),o=t.filter(a=>a.intersectionRatio>=this.intersectionRatioThreshold).length===this.visibleLength?e+1:e,l=t[o],n=l.boundingClientRect.left-l.rootBounds.left;this.translateX-=n,this.setDomTranslateX(this.translateX);const r=Math.abs(this.translateX);setTimeout(()=>{r>=this.rightBorder&&(this.translateX=-(this.itemFullWidthValue*(o-this.list.length)),this.setDomTranslateX(this.translateX))},this.slideAnimationDuration)})},initOffset(){let t=0;if(f.isNumber(this.initialOffset))t=this.initialOffset;else if(d.getCssUnit(this.initialOffset)==="px")t=d.getCssValue(this.initialOffset);else{const i=document.createElement("div");i.setAttribute("style",`width: ${this.initialOffset}; position: fixed; top: 9999px`),document.body.appendChild(i),t=d.getDomPropertyValue(i,"width"),document.body.removeChild(i)}this.translateX=this.getDomTranslateX(),this.setMove(t)},slidePrev(){if(this.itemWidthMode!==T.COMPUTED)throw new Error("\u4EC5 computed-item-width \u6A21\u5F0F\u652F\u6301 slidePrev");this.handleSlide(!0)},slideNext(){if(this.itemWidthMode!==T.COMPUTED)throw new Error("\u4EC5 computed-item-width \u6A21\u5F0F\u652F\u6301 slideNext");this.handleSlide()},touchstart(t){this.playing=!0,cancelAnimationFrame(this.animationInterval);const e=t.targetTouches[0];this.lastX=e.pageX,this.translateX=this.getDomTranslateX()},touchmove(t){const e=t.targetTouches[0],i=e.pageX-this.lastX;this.lastX=e.pageX,this.setMove(i)},touchend(){this.playing=!1,this.autoPlay&&this.replay()},touchcancel(){this.touchend()}},created(){if(this.itemWidthMode===T.COMPUTED){if(!this.visibleLength)throw new Error("visibleLength \u5FC5\u987B\u4E3A\u5927\u4E8E 0 \u7684\u6574\u6570");this.initItemWidth()}this.initDoubleList()},mounted(){this.initItemWidthValue();const t=this.initTranslateX();if(this.leftBorder=t,this.rightBorder=this.itemFullWidthValue*this.list.length+t,this.initialOffset&&this.initOffset(),this.autoPlay){if(this.playImmediate){this.play();return}this.replay()}this.handleSlide=f.throttle(e=>{cancelAnimationFrame(this.animationInterval),Object.assign(this.$refs.swiperWrapper.style,{"transition-duration":`${this.slideAnimationDuration}ms`}),this.translateX=this.getDomTranslateX(),e?this._slidePrev():this._slideNext(),setTimeout(()=>{Object.assign(this.$refs.swiperWrapper.style,{"transition-duration":"0ms"}),this.autoPlay&&this.replay()},this.slideAnimationDuration)},this.slideAnimationDuration+200,{trailing:!1})},beforeDestroy(){clearTimeout(this.replayTimer),cancelAnimationFrame(this.animationInterval)}},Y={class:"za-swiper"},tt=["data-index"];function et(t,e,i,o,l,n){return s.openBlock(),s.createElementBlock("div",Y,[n.useLeft?(s.openBlock(),s.createElementBlock("div",{key:0,class:"za-swiper__btn",onClick:e[0]||(e[0]=(...r)=>n.slidePrev&&n.slidePrev(...r)),style:s.normalizeStyle(n.customBtnStyle)},[s.renderSlot(t.$slots,"left",{},void 0,!0)],4)):s.createCommentVNode("",!0),s.createElementVNode("div",{class:"za-swiper__list-wrapper",ref:"swiperBody",onTouchstart:e[1]||(e[1]=(...r)=>n.touchstart&&n.touchstart(...r)),onTouchmove:e[2]||(e[2]=(...r)=>n.touchmove&&n.touchmove(...r)),onTouchend:e[3]||(e[3]=(...r)=>n.touchend&&n.touchend(...r)),onTouchcancel:e[4]||(e[4]=(...r)=>n.touchcancel&&n.touchcancel(...r))},[s.createElementVNode("div",{class:"za-swiper__list",ref:"swiperWrapper",style:s.normalizeStyle({width:n.computedInnerWidth,height:n.computedInnerHeight,transform:"translateX(0px)"})},[(s.openBlock(!0),s.createElementBlock(s.Fragment,null,s.renderList(l.doubleList,(r,a)=>(s.openBlock(),s.createElementBlock("div",{class:"za-swiper__item",ref_for:!0,ref:"swiperItems",style:s.normalizeStyle({marginRight:n.computedSpanGap,width:l.itemWidth,height:"100%"}),"data-index":a,key:a},[s.renderSlot(t.$slots,"default",{item:r,index:a},void 0,!0)],12,tt))),128))],4)],544),n.useRight?(s.openBlock(),s.createElementBlock("div",{key:1,class:"za-swiper__btn",onClick:e[5]||(e[5]=(...r)=>n.slideNext&&n.slideNext(...r)),style:s.normalizeStyle(n.customBtnStyle)},[s.renderSlot(t.$slots,"right",{},void 0,!0)],4)):s.createCommentVNode("",!0)])}var it=K(Q,[["render",et],["__scopeId","data-v-82881cae"]]);return it});