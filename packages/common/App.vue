<template>
  <div class="demo-page">
    <div class="demo-page__swiper-box">
      <div class="demo-page__title">基础用法</div>
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
          <img class="demo-page__icon" src="./assets/images/icon-triangle-left.png">
        </template>

        <template #default="{ item }">
          <!-- item 父容器的宽高在 Swiper 内部已经计算好，开发者在这里的 item 样式可以使用 width: 100%、height: 100% 铺满外层 -->
          <img :src="item"
               @click="testClick"
               class="demo-page__item"/>
        </template>

        <template #right>
          <img class="demo-page__icon" src="./assets/images/icon-triangle-right.png">
        </template>

      </za-swiper>
    </div>

    <div class="demo-page__swiper-box">
      <div class="demo-page__title">纵向滚动</div>
      <za-swiper
        v-if="list.length"
        direction="vertical"
        :list="list"
        :visible-length="4"
        :inner-height="270"
        :inner-width="270"
        :side-gap="16"
        :span-gap="16">

        <template #default="{ item }">
          <!-- item 父容器的宽高在 Swiper 内部已经计算好，开发者在这里的 item 样式可以使用 width: 100%、height: 100% 铺满外层 -->
          <img :src="item"
               @click="testClick"
               class="demo-page__item"/>
        </template>
      </za-swiper>
    </div>

    <div class="demo-page__swiper-box">
      <div class="demo-page__title">自定义元素高度</div>
      <za-swiper
        v-if="list.length"
        item-size-mode="custom"
        direction="vertical"
        :list="list"
        :visible-length="4"
        :inner-height="100"
        :inner-width="270"
        :side-gap="16"
        :span-gap="16">

        <template #default="{ item }">
          <img :src="item"
               @click="testClick"
               class="demo-page__item demo-page__item--custom"/>
        </template>
      </za-swiper>
    </div>
  </div>
</template>

<script>
// 测试用
// import ZaSwiper from '@next-fe/vue-za-swiper'
// import '@next-fe/vue-za-swiper/dist/style.css'
import ZaSwiper from './za-swiper/index'
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
  methods: {
    testClick() {
      console.log('testClick....')
    }
  }
}
</script>

<style lang="scss" scoped>
$grey: rgba(69,90,100,.6);

.demo-page {
  background: center/cover #fff;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  &__icon {
    width: 20px;
  }

  &__swiper-box {
    background: #f7f8fa;
    width: 100%;

    div:nth-child(2) {
      display: flex;
      justify-content: center;
      background: #fff;
      padding: 20px 0;

      ::v-deep(.za-swiper__list-wrapper) {
        background: #f1f1f1;
      }
    }
  }

  &__title {
    padding: 32px 16px 16px;
    color: $grey;
    font-weight: 400;
    font-size: 14px;
    line-height: 16px;
  }

  &__item {
    box-sizing: border-box;
    border: 2px solid $grey;
    width: 100%;
    height: 100%;
    object-fit: contain;
    border-radius: 8px;

    &--custom {
      height: 44px;
    }
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
