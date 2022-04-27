<template>
  <div class="demo-page">
    <div class="demo-page__swiper-box">
      <z-swiper
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

      </z-swiper>
    </div>
  </div>
</template>

<script>
import ZSwiper from './z-swiper/index'
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
    ZSwiper,
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
