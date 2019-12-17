<template>
  <div class="ui-index">
    我是{{$route.meta.text}}
    <router-link :to="$route.meta.to">PageJump</router-link>
    <div @click="goHome">跳转至新入口-HOME</div>
  </div>
</template>
<script>
export default {
  name: 'ui-index',
  methods: {
    goHome() {
      location.href = `/${process.env.PROJECT_NAME}`
    }
  }
}
</script>
<style lang="less" scoped>
.ui-index{
  color: red;
}
</style>
