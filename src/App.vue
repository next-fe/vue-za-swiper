<template>
  <div class="demo-page">
    <div class="demo-page__swiper-box">
      <z-swiper
          v-if="list.length"
          :auto-play="false"
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
html, body {
  padding: 0;
  margin: 0;
  background: darkslategrey;
}

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
  @include flex-center();

  &__swiper-box {
    margin-top: 10px;
    min-height: 55px;
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
