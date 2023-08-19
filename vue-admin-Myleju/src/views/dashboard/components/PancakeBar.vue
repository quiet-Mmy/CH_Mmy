<template>
  <div class="Pancake-main">
    <div id="pancake" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
export default {
  // 当前页面的name
  name: '',
  mixins: [],
  data() {
    return {}
  },
  created() {},
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const pancakeEcharts = echarts.init(document.getElementById('pancake'))
      const option = {
        animationEasing: 'bounceOut', // 设置缓动动画
        // title样式
        title: {
          text: '购买终端',
          textStyle: {
            color: '#8e9cc6',
            fontWeight: '600',
            fontSize: '20'
          }
        },
        // 中间根据数据展示的小按钮
        legend: {
          top: 'bottom'
          // top: 'top'
        },
        // 右上角的工具盒
        // toolbox: {
        //   show: true,
        //   feature: {
        //     mark: { show: true },
        //     dataView: { show: true, readOnly: false },
        //     restore: { show: true },
        //     saveAsImage: { show: true }
        //   }
        // },
        tooltip: {
          backgroundColor: 'rgba(0,0,0,0.5)', // 直接rgba背景  用''包裹rgba
          textStyle: {
            color: '#ffffff' // 设置他的字体颜色
          },
          borderWidth: 0, // 设置边框
          formatter: '{b}: {c}'
          // a代表系列名 b对应当前的数据名  c对应当前的数据值  (可以使用br换行)
          // 这个也可以写成回调函数的形式
        },

        series: [
          {
            name: 'Nightingale Chart',
            type: 'pie',
            radius: [50, 130], // 半径图 第一个小半径和第二个半径
            center: ['50%', '50%'], // 水平方向
            roseType: 'area',
            itemStyle: {
              borderRadius: 0 // 每一个的圆角
            },
            // 设置线的长度
            labelLine: {
              length: '20', // 第一段的长度
              length2: '30'// 第二段的长度
            },
            data: [
              {
                value: 30,
                name: '唱',
                itemStyle: {
                  // 线性渐变
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#037228' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#d323a7' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                }, // 添加文字的颜色
                label: {
                  color: '#3e5c4c',
                  fontSize: '20'
                }
              },
              {
                value: 25,
                name: '跳',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#6848dc' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#24a9ff' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                },
                label: {
                  color: '#3f81f0',
                  fontSize: '20'
                }
              },
              {
                value: 20,
                name: 'rap',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#bd00ff' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#ff6700' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                },
                label: {
                  color: '#da2e8d',
                  fontSize: '20'
                }
              },
              {
                value: 15,
                name: '篮球',
                itemStyle: {
                  color: {
                    type: 'linear',
                    x: 0,
                    y: 0,
                    x2: 0,
                    y2: 1,
                    colorStops: [{
                      offset: 0, color: '#3996ff' // 0% 处的颜色
                    }, {
                      offset: 1, color: '#871d89' // 100% 处的颜色
                    }],
                    global: false // 缺省为 false
                  }
                },
                label: {
                  color: '#5a62cc',
                  fontSize: '20'
                }
              }
            ]
          }
        ]
      }

      pancakeEcharts.setOption(option)
    }
  }
}
</script>
<style scoped lang='scss'>
.Pancake-main {
  width: 100%;
  height: 100%;
  #pancake {
    width: 100%;
    height: 100%;
  }
}
</style>
