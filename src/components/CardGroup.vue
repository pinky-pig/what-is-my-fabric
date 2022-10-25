<script setup lang="ts">
const list = [
  {
    title: 'Icons Basic Edit',
    subtitle: 'To learn svg',
    address: 'https://github.com/pinky-pig/icons-basic-edit.git',
    imgUrl: 'https://cdn.jsdelivr.net/gh/pinky-pig/pic-bed/images20221002104728.png',
    preview: 'https://pinky-pig.github.io/icons-basic-edit/',
  },
  {
    title: 'What Is My Blog',
    subtitle: 'To notes and share',
    address: 'https://github.com/pinky-pig/what-is-my-blog.git',
    imgUrl: 'https://cdn.jsdelivr.net/gh/pinky-pig/pic-bed/images20221002110434.png',
    preview: 'https://pinky-pig.github.io/what-is-my-blog/',
  },
]
</script>

<template>
  <div class="mt-4 grid grid-cols-1 gap-8 print:grid-cols-2 sm:grid-cols-2 lg:gap-6">
    <div v-for="item in list" :key="item.title" class="card bg-[var(--bg-contrary-light)]">
      <div class="card-body">
        <h4 class="card-title">
          {{ item.title }}
        </h4>
        <h5 class="card-subtitle">
          {{ item.subtitle }}
          <a class="text-10px" :href="item.address">github</a>
        </h5>
        <p class="card-text">
          <a :href="item.preview">
            <img :src="item.imgUrl" alt="">
          </a>
        </p>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
.card{
  background-image: var(--geometry-bg);
}
</style>
