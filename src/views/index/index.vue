<template>
  <div class="index">
    <!-- 主体 -->
    <div class="main">
      <!-- logo -->
      <div class="logo">
        <img :src="logo"
             alt="">
      </div>
      <!-- 搜素框 -->
      <div class="selectInput"
           @keyup.enter="handleSearch">
        <div class="inputBox">
          <input placeholder="请输入企业名称或个人名称"
                    v-model="val">
          <i class="arrow"></i>
        </div>

        <button class="sBtn"
                   v-focus
                   @click="handleSearch">查&nbsp;&nbsp;&nbsp;&nbsp;询</button>

      </div>
    </div>
  </div>
</template>

<script>
import logo from '@/assets/imgs/index/home_logo.png'
import icon1 from '@/assets/imgs/index/1.png'
import icon2 from '@/assets/imgs/index/2.png'
import icon3 from '@/assets/imgs/index/3.png'
import icon4 from '@/assets/imgs/index/4.png'
import searchIcon from '@/assets/imgs/index/home_search.png'

import { getList } from '@/api/test'

export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      // img
      logo: logo,
      searchIcon: searchIcon,
      // 搜索框内容
      val: '',
      isShow: true,
      // 四个图标
      iconList: [
        { img: icon1, text: '申请标识', url: 'modeindex' },
        { img: icon2, text: '最新公告', url: 'newnotice' },
        { img: icon3, text: '我的标识', url: 'myrecord' },
        { img: icon4, text: '标识申请指南', url: 'guide' }
      ]
    }
  },
  methods: {
    // 查询
    handleSearch () {
      if(this.val) {
        let obj = {
          name: this.val
        }

        this.$loading()

        setTimeout(() => {
          this.$closeLoading()
          this.$router.push({ name: 'test', params: obj })
        }, 2000)
      }
    }
  },
  mounted () {
    getList().then(rs => {
      console.log(rs)
    })
  }
}
</script>

<style lang="less">
.index {
  width: 100%;
  min-height: 857px;
  background: url("~@/assets/imgs/index/home_bg.png") no-repeat;
  background-size: 100% 387px;
  nav {
    width: 100%;
    height: 86px;
    > div {
      height: 86px;
      margin: 0 auto;
      width: 1130px;
    }
  }
  .main {
    width: 1130px;
    margin: 0 auto;
    padding-top: 57px;
    position: relative;
    .logo {
      width: 674px;
      margin: 0 auto;
      margin-bottom: 115px;
      text-align: justify;
      text-align-last: justify;
      .title {
        font-size: 40px;
        font-weight: bold;
        color: @ui_font_y;
      }
    }

    .itemContainer {
      width: 674px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      .itemSingle {
        .s0,
        .s2 {
          img {
            margin-left: 7px;
          }
        }
        p {
          text-align: center;
          color: @ui_font_black;
          cursor: pointer;
          &:hover {
            color: @ui_font_y1;
          }
        }
        .imgBox {
          width: 78px;
          height: 78px;
          border-radius: 50%;
          margin-bottom: 8px;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid rgba(213, 181, 96, 1);
        }
        img {
          width: 41px;
          height: 42px;
          cursor: pointer;
        }
      }
    }
    .reslutContainer {
      position: absolute;
      top: 330px;
    }
  }
}
</style>
