<template>
  <div id="app">
    <div class="appContainer">
      <router-view />
    </div>
    <bottomNav />
  </div>
</template>
<script>
export default {
  created() {
    console.log('=====================')
    console.log(this.$utils.browser)
    console.log('=====================')
    console.log(this.$exMethod)
  }
}
</script>
<style lang="less">
html,
body,
#app {
  width: 100%;
  min-width: 1140px;
}
.appContainer {
  min-height: 857px;
}
html {
  overflow-y: scroll;
}
</style>
