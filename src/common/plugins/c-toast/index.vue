<template>
  <div class="c-toast">
    <div class="tips-container" :class="[showFlag? 'fade-in' : 'fade-out']">
      <p class="text">{{ msg }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'c-toast',
  data () {
    return {
      msg: 'Hello',
      showFlag: false
    }
  }
}
</script>

<style lang="less" scoped>
.c-toast {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 2000;
  display: flex;
  align-items: center;
  justify-content: center;
  .tips-container {
    max-width: 300px;
    padding: 20px 20px;
    text-align: center;
    border-radius: 13px;
    background-color: rgba(0, 0, 0, 0.6);
    overflow: hidden;
    .text {
      line-height: 2;
      font-size: 15px;
      color: #fff;
    }
  }
}

.fade-in {
  animation-name: fade-in;
  animation-duration: 0.3s;
  animation-fill-mode: both;
}
.fade-out {
  animation-name: fade-out;
  animation-duration: 0.3s;
  animation-fill-mode: both;

}

@keyframes fade-in {
  0% {
    opacity: 0;
    transform: scale(0.7);
  }
  100% {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes fade-out {
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0.7);
  }
}
</style>
