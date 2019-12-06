<template>
  <div class="ui-index">
    我是{{$route.meta.text}}<router-link :to="$route.meta.to">PageJump</router-link>
  </div>
</template>
<script>
export default {
  name: 'ui-index'
}
</script>
<style lang="less" scoped>
.ui-index{
  color: red;
}
</style>
