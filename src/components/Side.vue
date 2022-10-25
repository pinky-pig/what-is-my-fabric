<script setup lang="ts">
import CustomCard from '~/components/CustomCard.vue'
import { modules } from '~/views/article'

const reg = /\.\/(\S*)\.md/
let list = Object.keys(modules).map((item) => {
  const result = item.match(reg)
  if (result)
    return result[1]
  else
    return ''
})
// 删除假值 false 0 undefined null NaN
list = list.filter(Boolean)
const route = useRoute()
</script>

<template>
  <CustomCard>
    <div class="wrapper">
      <router-link
        v-for="(it, idx) in list"
        :key="idx"
        :to="`/post/${idx}`"
        class="list"
        :class="route.params.no === (`${idx}`) ? 'activated' : ''"
      >
        第 {{ idx + 1 }} 期 - {{ it }}
      </router-link>
    </div>
  </CustomCard>
</template>

<style lang="less" scoped>
.wrapper {
  @apply overflow-y-auto overflow-x-hidden;
}

.list {
  font-size: 1rem;
  margin: 1px;
  padding: 0.3rem 0.2rem;
  color: inherit;
  text-decoration: none;
  display: block;

  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.list:hover {
  color: #a67c52;
}

.activated {
  font-weight: 600;
  color: #a67c52;

}
</style>
