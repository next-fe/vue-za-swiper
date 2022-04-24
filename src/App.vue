<template>
  <div class="demo-page__swiper-box">
    <z-swiper
        v-if="list.length"
        auto-play
        :list="list"
        :visible-length="4"
        :inner-height="110"
        :inner-width="540"
        :side-gap="18"
        :span-gap="32">

      <img
          slot="left"
          src="./assets/images/icon-triangle-left.png">

      <img
          slot-scope="{ item }"
          :src="item"
          class="demo-page__item"/>

      <img
          slot="right"
          src="./assets/images/icon-triangle-right.png">
    </z-swiper>
  </div>
</template>

<script>
import ZSwiper from './components/z-swiper.vue'
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
      }, 100);
    })
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>

<style lang="scss" scoped>
@import './assets/styles/common';

.demo-page {
  @include relative-center();

  &__text {
    margin-top: 48px;
    margin-left: 32px;
  }

  &__data {
    @include flex-center();
    height: 76px;
    margin-top: 8px;
    font-weight: 500;
    font-size: 44px;

    & > span {
      color: #5AE1FF;
      font-size: 52px;
    }
  }

  &__swiper-box {
    margin-top: 20px;
    min-height: 110px;
  }

  &__item {
    border: 2px solid #FFFFFF;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
  }

  &__desc {
    margin-top: 28px;
    font-size: 26px;
    color: #FFFFFF;
    text-align: center;
    line-height: 40px;
  }
}
</style>
