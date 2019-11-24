<template>
  <div class="bottomNav">
    <ul>
      <li v-for="item in liList"
          :key="item.id">{{item}}</li>
    </ul>
    <p>{{text}}</p>
  </div>
</template>

<script>
export default {
  name: 'bottomNav',
  data () {
    return {
      liList: ['关于我们', '专委会介绍', '组织架构', '联系方式'],
      text: ''
    }
  },
  created () {
  }
}
</script>

<style lang="less">
.bottomNav {
  width: 100%;
  height: 80px;
  padding: 20px 0;
  border-top: 1px solid @ui_border_gray;
  ul {
    list-style: none;
    display: flex;
    justify-content: center;
    align-items: center;
    li {
      font-size: 14px;
      line-height: 14px;
      padding: 0 20px;
      color: #727272;
      border-right: 1px solid #9fa5b7;
    }
    li:last-child {
      border-right: 0;
    }
  }
  p {
    margin-top: 10px;
    font-size: 14px;
    text-align: center;
    color: #727272;
  }
}
</style>
