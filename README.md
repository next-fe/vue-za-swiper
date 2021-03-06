# vue-za-swiper
![demo](./docs/assets/demo.gif)

## 概述

![vue-za-swiper-function](./docs/assets/vue-za-swiper-function.png)

## 安装及使用
### Vu3
安装：
```shell
npm i @next-fe/vue-za-swiper
```

使用：
```js
import ZaSwiper from '@next-fe/vue-za-swiper'
import '@next-fe/vue-za-swiper/dist/style.css'
```

### Vu2
安装：
```shell
npm i @next-fe/vue-za-swiper@1
```

使用：
```js
import ZaSwiper from '@next-fe/vue-za-swiper'
import '@next-fe/vue-za-swiper/dist/style.css'
```

## 代码示例

```vue
<template>
  <div class="demo-page">
    <div class="demo-page__swiper-box">
      <za-swiper
        v-if="list.length"
        auto-play
        :list="list"
        :visible-length="4"
        :inner-height="55"
        :inner-width="270"
        :side-gap="16"
        :span-gap="16">

        <template #left>
          <img src="./assets/images/icon-triangle-left.png">
        </template>

        <template #default="{ item }">
          <!-- item 父容器的宽高在 Swiper 内部已经计算好，开发者在这里的 item 样式可以使用 width: 100%、height: 100% 铺满外层 -->
          <img :src="item"
               class="demo-page__item"/>
        </template>

        <template #right>
          <img src="./assets/images/icon-triangle-right.png">
        </template>

      </za-swiper>
    </div>
  </div>
</template>

<script>
import '@next-fe/vue-za-swiper/dist/style.css'
import ZaSwiper from '@next-fe/vue-za-swiper'
import IMG1 from './assets/images/model/1.png'
import IMG2 from './assets/images/model/2.png'
import IMG3 from './assets/images/model/3.png'
import IMG4 from './assets/images/model/4.png'
import IMG5 from './assets/images/model/5.png'
import IMG6 from './assets/images/model/6.png'
import IMG7 from './assets/images/model/7.png'
import IMG8 from './assets/images/model/8.png'

export default {
  components: {
    ZaSwiper,
  },
  data() {
    return {
      list: [],
    }
  },
  async created() {
    // get data from server
    this.list = await new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          IMG1,
          IMG2,
          IMG3,
          IMG4,
          IMG5,
          IMG6,
          IMG7,
          IMG8,
        ])
      }, 100)
    })
  },
}
</script>

<style lang="scss" scoped>
.demo-page {
  background: center/cover url("common/assets/images/main-bg.jpeg");
  width: 100vw;
  height: 100vh;

  &__swiper-box {
    min-height: 55px;
    position: absolute;
    top: 80px;
  }

  &__item {
    box-sizing: border-box;
    border: 2px solid #FFFFFF;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
  }

  &__desc {
    margin-top: 14px;
    font-size: 13px;
    color: #FFFFFF;
    text-align: center;
    line-height: 20px;
  }
}
</style>
```

## API

### Props
该组件所有属性均为非响应式属性，所以开发者需要保证数组加载完成才渲染组件，不然可能会有异常。

| 参数                       | 说明                                                                                                                                                                                   | 类型                  | 默认值        |
|--------------------------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------------------|------------|
| direction                | `horizontal`：横向滚动，`vertical`：纵向滚动                                                                                                                                                    | _string_            | `horizontal`         |
| item-size-mode           | `computed`：组件内部使用 `visible-length` 计算元素宽/高（direction 为 `horizontal` 时计算宽，为 `vertical` 时计算高），`custom`： 自定义元素宽高。仅当 direction 为 `horizontal` 且 item-width-mode 为 `computed` 时才能使用按钮滑动功能 | _string_            | `computed` |
| list                     | 数组，必填                                                                                                                                                                                | _Array\<any>_       | -          |
| visible-length           | 可视元素个数，当 `item-size-mode` 为 `computed` 时必填                                                                                                                                          | _number_            | -          |
| inner-height             | 播放栏高度，默认单位为 `px`，必填                                                                                                                                                                  | _number_ / _string_ | -          |
| inner-width              | 播放栏宽度，默认单位为 `px`，必填                                                                                                                                                                  | _number_ / _string_ | -          |
| span-gap                 | 元素间距，默认单位 `px`                                                                                                                                                                       | _number_ / _string_ | `0`        |
| side-gap                 | 两边间距，默认单位 `px`                                                                                                                                                                       | _number_ / _string_ | `0`        |
| auto-play                | 是否自动播放                                                                                                                                                                               | _boolean_           | `false`    |
| step                     | 播放速度，一帧移动距离，单位 `px`                                                                                                                                                                  | _number_            | `-0.5`     |
| play-delay               | 滑动停止后再播放时间间隔，单位 `ms`                                                                                                                                                                 | _number_            | `2000`     |
| play-immediate           | 组件渲染后是否立即自动播放，`auto-play` 为 `true` 时该属性才生效                                                                                                                                           | _boolean_           | `false`    |
| slide-animation-duration | 点击左右按钮后滑动动画时长，单位 `ms`                                                                                                                                                                | _number_            | `300`      |
| initial-offset           | 初始偏移量，支持负数，默认单位为 `px`                                                                                                                                                                | _number_ / _string_ | `0`        |

### Methods
| 名称           | 说明                         | 参数 |  返回值 |
|--------------|----------------------------|--|-----------------------|
| slidePrev   | 滑动至上一个元素 | - | - |
| slideNext |  滑动至下一个元素  | - | - |

### Slots

| 名称    | 说明   | 参数              |
|-------|------|-----------------|
| -     | 列表元素 | { item, index } |
| left  | 左按钮  | -               |
| right | 右按钮  | -               |

## 相关资源
- [vue-za-swiper 开发文档](./dev.md)
- [vue-za-swiper 技术方案](./docs/technical-solution/index.md)
