<template>
  <div ref="dashboardContainer" class="dashboard-container">
    <!-- 设置加载动画 -->
    <dv-loading v-if="loading">Loading...</dv-loading>
    <div v-if="!loading" class="con">
      <!-- 头部 -->
      <div class="head">
        <!-- 全屏按钮 -->
        <div @click="fullScreen">
          <svg-icon icon-class="full" class-name="full" />
        </div>
        <div class="c">
          <span class="title">不凡数据大屏</span>
          <!-- title动画 -->
          <dv-decoration-5 style="width: 100%" />
        </div>
        <div class="data">
          {{ tiemD }}
        </div>
      </div>
      <!-- content内容部分 -->
      <div class="content flex">
        <div class="content-left content-item">
          <!-- 电商数据 -->
          <div class="commerce">
            <div class="txt">电商数据 <span class="col">Shell Data</span></div>
            <div class="box flex">
              <span class="fl">销售量</span>
              <span class="fr">万元</span>
            </div>
            <div class="nums">
              <span class="num">
                <!-- 动态数字 -->
                <countTo
                  :start-val="startVal"
                  :end-val="endVal"
                  :duration="2000"
                />
              </span>
            </div>
            <div class="complete">
              <span>完成百分比</span>
              <div class="c">
                <div class="line">
                  <span :style="'left:' + percentage + '%;'" class="sz">{{
                    percentage + '%'
                  }}</span>
                </div>
                <!-- 进度条 -->
                <el-progress :percentage="percentage" />
                <div class="line">
                  <div class="tig" :style="'left:' + percentage + '%;'" />
                </div>
              </div>
            </div>
          </div>

          <!-- 热词 -->
          <div class="hotWords">
            <div class="tit">
              <span class="hot">热门搜索词</span>
              <span class="">Top Search</span>
            </div>
            <!-- 热词 字符云-->
            <div class="characterHot">
              <WordEachart />
            </div>
          </div>
        </div>

        <!-- 中间 -->
        <div class="content-center content-item">
          <dv-border-box-10>
            <!-- 2用来放置图表 每一个实例对应一个盒子容器    树状图-->
            <div class="order-return-c">
              <OrderBar />
            </div>
            <div class="item">
              <!-- 气泡地图 -->
              <div class="map item-fl">
                <MapEchart />
              </div>
              <!-- 饼状图 -->
              <div class="bar item-fr">
                <Pacnake />
              </div>
            </div>
          </dv-border-box-10>
        </div>

        <!-- 最右边 -->
        <div class="right">
          <div class="right-t">
            <div class="txt">统计数据<span class="col">Shell Data</span></div>
            <div class="order">
              <div v-for="item in OrderLists" :key="item.Num" class="order-item">
                <img class="img" :src="item.url" alt="">
                <div class="numberS">
                  <div class="numberS-n">{{ item.Num }}</div>
                  <div class="text">{{ item.text }}</div>
                </div>
              </div>
            </div>
          </div>
          <div class="right-b">
            <div class="txt">大额订单Top<span class="col">Supper Orders</span></div>
            <!-- 订单列表图 -->
            <div class="productListTime">
              <div class="tit">
                <span class="span">时间</span>
                <span class="span">物品</span>
                <span class="span">数量</span>
                <span class="span">金额</span>
              </div>
              <dv-scroll-board :config="config" style="410px" />
            </div>
          </div>
        </div>
      </div>

      <!-- 粒子动画背景 -->
      <div class="bg-animate">
        <BgAnimate />
      </div>
    </div>
  </div>
</template>

<script>
// 1.导入echarts
// import * as echarts from 'echarts'

import screenfull from 'screenfull' // 导入全屏插件
import countTo from 'vue-count-to' // 动态数字插件
import OrderBar from './components/OrderBar.vue' // 导入树状图
import WordEachart from './components/WordEacharts.vue' // 导入字符云
import MapEchart from './components/mapTable.vue'// 导入气泡地图
import Pacnake from './components/PancakeBar.vue'// 导入饼状图
import BgAnimate from './components/BgAnimate.vue' // 导入粒子动画canvers
export default {

  name: 'Dashboard',
  components: {
    OrderBar,
    countTo,
    WordEachart,
    MapEchart,
    Pacnake,
    BgAnimate
  },
  data() {
    return {
      config: '',
      //  设置订单列表的title
      index: true,
      columnWidth: [50],
      align: ['center'],

      loading: true, // 设置loading
      currentTime: new Date(), // 设置时间
      startVal: 0,
      endVal: Math.floor(Math.random() * 100000000),
      percentage: 10, // 进度条百分比
      OrderLists: [
        {
          url: require('@/icons/one.png'),
          text: '订单总数(万)',
          Num: (Math.random() * 100).toFixed(2)
        },
        {
          url: require('@/icons/two.png'),
          text: '销售总量 (万元)',
          Num: (Math.random() * 1000).toFixed(2)
        },
        {
          url: require('@/icons/three.png'),
          text: '人均消费',
          Num: (Math.random() * 500).toFixed(2)
        },
        {
          url: require('@/icons/four.png'),
          text: '近十分钟新增订单数量',
          Num: Math.floor(Math.random() * 1000)
        }
      ]
    }
  },
  computed: {
    // 计算属性 返回时间
    tiemD() {
      const options = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric'
      }
      return this.currentTime
        .toLocaleString('zh-CN', options)
        .replace(/\//g, '-')
    }
  },
  created() {
    //  设置订单列表的轮播
    this.config = { data: [
      ['2021-20-01', '指甲剪', '20', '20000'],
      ['2021-20-02', '猫条', '10', '2002'],
      ['2021-20-03', '猫罐头', '30', '110022'],
      ['2021-20-04', '猫粮', '20', '20192'],
      ['2021-20-05', '猫砂', '23', '2093'],
      ['2021-20-06', '猫薄荷', '102', '1022'],
      ['2021-20-06', '猫抓板', '10', '203'],
      ['2021-20-07', '猫爪', '2', '12']
    ] }
    this.setLoading() // 调用loading动画
  },
  // 3初始化echarts
  mounted() {
    // 调用时间
    this.nums()
    // 调用加载进度条
    this.progress()
  },

  methods: {
    // 设置时间
    nums() {
      // 每500毫秒更新一次时间
      setInterval(() => {
        this.currentTime = new Date()
      }, 1000)
    },
    // 设置loading动画
    setLoading() {
      const time = setTimeout(() => {
        this.loading = false
        clearTimeout(time)
      }, 1000)
    },
    // 设置进度条
    progress() {
      const per = Math.floor(Math.random() * 51) + 45
      // const per = 79
      // 每500毫秒更新一次时间
      setInterval(() => {
        if (this.percentage <= per) {
          this.percentage++
        }
      }, 50)
    },
    // 点击全屏
    fullScreen() {
      if (screenfull.isEnabled) {
        // 控制是否全屏的按钮   里面是需要全屏的dom元素
        screenfull.toggle(this.$refs.dashboardContainer)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.con{
  position: relative;
  .bg-animate{
    position: absolute;
    left: 0;
    bottom: -100px;
    width: 100%;
    height: 40%;
  }
}

.word-container {
  width: 400px;
  height: 400px;
  border: 1px solid red;
  margin: 0 auto;
}
::v-deep .dv-scroll-board{
  .rows{
    height: 410px !important;
    .row-item{
      height: 70px !important;
      line-height: 70px !important;
      text-align: center;
    }
  }
}
::v-deep .el-progress-bar__inner {
  background: linear-gradient(90deg, #24cbff 30%, #9000ff);
}
::v-deep .el-progress-bar__outer {
  height: 12px !important;
  background-color: #283052;
}
::v-deep .el-icon-caret-top:before {
  font-size: 20px;
}

::v-deep .el-progress__text {
  display: none;
}

.flex {
  display: flex;
}
.dashboard-container {
  background-color: #0a1631;
  width: 100%;
  // height: 100vh;
  height: 1000px;
  #picture {
    width: 500px;
    height: 300px;
  }
  .order-return-c {
    padding-top: 10px;
    width: 100%;
    height: 360px;
  }
  .head {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 150px;
    .full {
      position: absolute;
      width: 25px;
      height: 25px;
      left: 10px;
      top: 10px;
    }
    .data {
      position: absolute;
      right: 30px;
      top: 20px;
      color: #fff;
      font-size: 22px;
      font-family: Microsoft Yahei, Arial, sans-serif;
    }
    .c {
      position: relative;
      margin: 0 auto;
      width: 70%;
      height: 122px;
      text-align: center;
      line-height: 100px;
      font-size: 36px;
    }
    .title {
      position: absolute;
      left: 50%;
      top: -10px;
      transform: translateX(-50%);
      font-weight: 800;
      background-image: linear-gradient(
        to right,
        rgb(233, 133, 226),
        rgb(201, 63, 240)
      );
      -webkit-background-clip: text;
      -moz-background-clip: text;
      background-clip: text;
      color: transparent;
      text-shadow: 0px 2px 20px rgb(13, 222, 222, 0.7);
    }
    .title::before {
      content: '';
      width: 70%;
      height: 4px;
      background-color: #00c0ff;
      position: absolute;
      top: 81px;
      left: 40px;
    }
  }
  // 内容部分
  .content {
    // height: 100vh;
    width: 100%;
    .right{
      width: 25%;
      // height: 100%;
      box-sizing: border-box;
      margin-right: 10px;
      &-t{
        height: 250px;
        overflow: hidden;
        .txt {
          font-size: 22px;
          color: #9aa8d4;
          .col {
            font-size: 20px;
            color: #404d69;
          }
        }
        .order{
          display: flex;
          flex-wrap: wrap;
          width: 100%;
          height: 150px;
          &-item{
            display: flex;
            width: 50%;
            height: 50%;
            margin-top: 20px;
            .img{
              width: 35%;
              height: 100%;
            }
            .numberS{
              display: flex;
              justify-content: center;
              flex-direction: column;
              width: 65%;
              height: 100%;
              padding-left: 10px;
              box-sizing: border-box;
              &-n{
                font-size: 32px;
                font-weight: 700;
                color: rgb(255, 255, 255);
              }
              .text{
                font-size: 12px;
               color: rgb(176, 194, 249);
              }
            }
          }
        }
      }
      &-b{
        .txt {
          font-size: 22px;
          color: #9aa8d4;
          margin-bottom: 20px;
          .col {
            font-size: 20px;
            color: #404d69;
          }
        }
        .productListTime{
          display: flex;
          align-items: center;
          flex-direction: column;
          width: 100%;
          height: 450px;
          .tit{
            display: flex;
            align-items: center;
            height: 40px;
            width: 100%;
            box-sizing: border-box;
            border: 1px solid #33416b;
            color: #fff;
            .span{
              display: block;
            width: 25%;
            height: 100%;
            line-height: 40px;
            text-align: center;
            }
          }
        }
      }

    }
    .content-item {
      box-sizing: border-box;
      padding: 0px 0 0 10px;
    }
    // 中间部分内容
    .content-center {
      width: 50%;
      padding: 0 20px;
      box-sizing: border-box;
      overflow: hidden;
      .item {
        display: flex;
        width: 95%;
        margin: 0 auto 10px;
        // background-color: #fff;
        height: 360px;
        &-fl {
          width: 50%;
          height: 100%;
        }
        &-fr {
          width: 50%;
          height: 100%;
          z-index: 99;
        }
      }

    }
    .content-left {
      width: 25%;
      .hotWords {
        width: 100%;
        font-size: 20px;
        color: #404d69;
        font-weight: 400;

        .hot {
          font-size: 22px;
          color: #9aa8d4;
          margin-right: 10px;
        }
        .characterHot {
          width: 100%;
          height: 390px;
          background-color: rgba(0, 0, 0, 0);
          position: relative;
          z-index: 99;
        }
      }
    }
    &-left {
      .commerce {
        width: 100%;
        .txt {
          font-size: 22px;
          color: #9aa8d4;
          .col {
            font-size: 20px;
            color: #404d69;
          }
        }
        .box {
          width: 100%;
          justify-content: space-between;
          margin-top: 20px;
          font-size: 16px;

          .fl {
            color: #9aa8d4;
          }
          .fr {
            color: #73aae5;
          }
        }
        .complete {
          font-size: 16px;
          color: #9aa8d4;
          margin-bottom: 20px;
          .c {
            width: 85%;
            margin: 20px auto;
            height: 50px;
          }
          .line {
            position: relative;
            width: 85%;
            height: 10px;
            .tig {
              transition: all 0.4s ease;
              position: absolute;
              top: 2px;
              margin-left: -10px;
              width: 0;
              height: 0;
              border-top: 0 solid transparent;
              border-right: 10px solid transparent;
              border-left: 10px solid transparent;
              border-bottom: 10px solid #fff;
            }
            .sz {
              position: absolute;
              top: -10px;
              font-size: 20px;
              font-weight: 700;
              color: #fff;
              width: 45px;
              text-align: center;
              transform: translateX(-50%);
            }
          }
        }
        .nums {
          display: flex;
          justify-content: center;
          width: 100%;
          padding: 20px 0px;
          .num {
            letter-spacing: 5px;
            font-size: 60px;
            font-weight: 700;
            color: #fff;
          }
        }
      }
    }
  }
}
</style>
