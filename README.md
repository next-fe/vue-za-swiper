# ZSwiper
![demo-gif](./docs/assets/demo.gif)

## 概述

## 代码示例

```vue

<template>
    <!-- 确保 list 加载完成才渲染组件-->
    <z-swiper
        v-if="dates.length"
        :list="dates"
        :visible-center-index="tabActiveIndex"
        :inner-height="71"
        :inner-width="530"
        :visible-length="5"
        :span-gap="20"
        :side-gap="27">

        <!--  编写左按钮样式 -->
        <z-image
            slot="left"
            :width="16"
            :height="31"
            :src="require('../assets/images/icon-left.png')"/>

        <!--  编写列表元素样式 -->
        <div
            slot-scope="{ item, index }"
            :class="getTabClass(item, index)"
            @click="changeDateTab(item, index)">
            {{ item.tabDate }}
        </div>

        <!--  编写右按钮样式 -->
        <z-image
            slot="right"
            :width="16"
            :height="31"
            :src="require('../assets/images/icon-right.png')"/>
    </z-swiper>
</template>

<script>
import { createComponent } from "@/common-v2/framework";

export default createComponent({
    data() {
        return {
            dates: [],
            tabActiveIndex: 3,
        }
    },
    methods: {
        changeDateTab(item, index) {
            if (item.disable) {
                return;
            }

            this.tabActiveIndex = index;
        },
        getTabClass(item, index) {
            const result = [ 'tab-item' ];
            const isActive = this.tabActiveIndex === index;

            if (isActive) {
                result.push('tab-item--active');
            } else if (item.disable) {
                result.push('tab-item--disable');
            }

            return result;
        }
    }
})
</script>
```

## API

### Props
该组件所有属性均为非响应式属性，所以开发者需要保证数组加载完成才渲染组件，不然可能会有异常。

| 参数                   | 说明                              | 类型            | 默认值      |
|----------------------|---------------------------------|---------------|----------|
| list                 | 数组，必填           | _Array\<any>_ | -        |
| inner-height         | 高度，单位 `px`，必填                   | _number_      | -        |
| inner-width          | 不包括 left、right slot，中部 tab 栏的宽度，必填 | _number_      | -        |
| visible-length       | 可视元素个数 ，必填                      | _number_      | -        |
| visible-center-index | 中央元素索引，组件 mounted 之后将该元素移动至视觉中央 | _number_ \    | _number_ | - |
| span-gap             | 元素间距，单位 `px`                    | _number_      | 0        |
| side-gap             | 两边间距，单位 `px`                    | _number_      | 0        |


### Methods
| 名称           | 说明                         | 参数 |  返回值 |
|--------------|----------------------------|--|-----------------------|
| slideLeft   | 向左滑动 | - | - |
| slideRight |  向右滑动  | - | - |

### Slots

| 名称    | 说明   | 参数              |
|-------|------|-----------------|
| -     | 列表元素 | { item, index } |
| left  | 左按钮  | -               |
| right | 右按钮  | -               |
