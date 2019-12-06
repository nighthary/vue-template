<template>
  <div class="index-index">
    我是index主页1
    <router-link :to="'/test'">totest</router-link>
  </div>
</template>
<script>
export default {
  name: 'index-index'
}
</script>
<style lang="less" scoped>
.index-index{
  color: blue;
}
</style>
