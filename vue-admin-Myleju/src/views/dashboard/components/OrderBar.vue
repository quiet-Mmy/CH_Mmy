<template>
  <div class="order-main">
    <!-- 设置容器 -->
    <div id="order-return" />
  </div>
</template>
<script>
// 1.导入echarts
import * as echarts from 'echarts'

// 导入data.js 模拟数据
import orderReturn from './data.js'

export default {
  // 当前页面的name
  name: '',
  mixins: [],
  data() {
    return {
      msg: 'Hello World'
    }
  },
  // 3初始化echarts
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const barEcharts = echarts.init(document.getElementById('order-return'))

      const dataList = orderReturn.map(item => item.date)
      const orderList = orderReturn.map(item => item.order)
      const returnNumList = orderReturn.map(item => item.returnNum)
      // 4 配置option
      const option = {
        animationEasing: 'bounceOut', // 设置缓动动画
        title: {
          text: '八月不凡家居数据图',
          textStyle: {
            color: '#8e9cc6',
            fontWeight: '600',
            fontSize: '20'
          }
        },
        xAxis: {
          type: 'category',
          data: dataList
          // axisLabel: { // 设置旋转多少度
          //   rotate: 60
          // }
        },
        yAxis: {
          type: 'value',
          splitNumber: 10, // 设置Y轴的间隙
          axisLine: {
            show: true // 设置Y轴的线显示
          },
          lineStyle: {
            color: '#757b89', // 设置Y轴线的颜色
            width: 0.5 // 设置线的宽度 可以设置小数？？？
          },
          axisTick: {
            show: true, // 展示Y轴的刻度
            lineStyle: {
              color: '#757b89' // 设置刻度的颜色
            }
          },
          splitLine: {
            show: false// 取消Y轴的横线  ？？？为什么是Y轴的
          }
        },

        // 鼠标放上去之后显示的文字信息
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.5)', // 直接rgba背景  用''包裹rgba
          textStyle: {
            color: '#ffffff' // 设置他的字体颜色
          },
          borderWidth: 0, // 设置边框
          // formatter: '{a}<br />{b}: {c}'
          // a代表系列名 b对应当前的数据名  c对应当前的数据值  (可以使用br换行)
          // 这个也可以写成回调函数的形式
          formatter: function(params, ticket, callback) {
            return `${params.seriesName}<br/>${params.marker}${params.name} : ${params.data}`
            // marker 小圆点
          }
        },
        legend: {
          // 设置状态的显示 跟系列series的name对应
          bottom: 10 // 距离容器的底部多少距离
        },
        // 系列 (一组数值 代表一个系列)
        series: [
          {
            color: '#00ff00',
            name: '订单销量',
            data: orderList, // 必须存在
            type: 'bar', // 图标类型柱状 必须存在
            itemStyle: {
              color: { // 设置颜色渐变
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#7010c7' // 0% 处的颜色
                }, {
                  offset: 0.5, color: '#b700fa' // 50% 处的颜色
                }, {
                  offset: 1, color: '#a10fc8' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          },
          {
            color: '#ff6700',
            name: '退货',
            data: returnNumList,
            type: 'bar', // 图标类型柱状
            // type: 'line'// 现行类型柱状

            itemStyle: {
              color: { // 设置颜色渐变
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [{
                  offset: 0, color: '#23c3fa' // 0% 处的颜色
                },
                {
                  offset: 0.5, color: '#249dff' // 50% 处的颜色
                },
                {
                  offset: 1, color: '#2495fe' // 100% 处的颜色
                }],
                global: false // 缺省为 false
              }
            }
          }
        ]
      }
      // 5.设置选项
      barEcharts.setOption(option)
    }
  }
}
</script>
<style scoped lang='scss'>
.order-main {
  width: 100%;
  height: 100%;
  #order-return {
    width: 100%;
    height: 100%;
  }
}
</style>
