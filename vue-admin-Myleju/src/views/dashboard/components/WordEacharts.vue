<template>
  <div class="word-main">
    <div id="word-echart" />
  </div>
</template>
<script>
import * as echarts from 'echarts'
// import 'echarts-wordcloud'
import '@/utils/echarts-wordcloud.min.js'
// import '@/utils/echarts-wordcloud'
export default {
  mixins: [],
  data() {
    return {
      msg: 'hello world'
    }
  },
  computed: {
  },
  watch: {
  },
  created() {
  },
  mounted() {
    this.init()
  },
  methods: {
    init() {
      const wordEchart = echarts.init(document.getElementById('word-echart'))
      const option = {
        // 系列
        series: [
          {
            type: 'wordCloud',

            // The shape of the "cloud" to draw. Can be any polar equation represented as a
            // callback function, or a keyword present. Available presents are circle (default),
            // cardioid (apple or heart shape curve, the most known polar equation), diamond (
            // alias of square), triangle-forward, triangle, (alias of triangle-upright, pentagon, and star.

            // shape: 'circle', // 形状 默认圆形
            shape: 'square', // 形状 正方形

            // Keep aspect ratio of maskImage or 1:1 for shapes
            // This option is supported since echarts-wordcloud@2.1.0
            keepAspect: false,

            // A silhouette image which the white area will be excluded from drawing texts.
            // The shape option will continue to apply as the shape of the cloud to grow.

            // maskImage: maskImage,

            // Folllowing left/top/width/height/right/bottom are used for positioning the word cloud
            // Default to be put in the center and has 75% x 80% size.

            // 热词的定位 占据面积
            left: 'center',
            top: 'center',
            width: '70%',
            height: '80%',
            right: null,
            bottom: null,

            // Text size range which the value in data will be mapped to.
            // Default to have minimum 12px and maximum 60px size.

            // 词云字体的最小字体和最大字体
            sizeRange: [12, 80],

            // Text rotation range and step in degree. Text will be rotated randomly in range [-90, 90] by rotationStep 45

            // 随机 旋转方向
            rotationRange: [-90, 50],
            // 一次旋转45°
            rotationStep: 50,

            // size of the grid in pixels for marking the availability of the canvas
            // the larger the grid size, the bigger the gap between words.

            // 坐标系的底框  网格？
            gridSize: 8,

            // set to true to allow word to be drawn partly outside of the canvas.
            // Allow word bigger than the size of the canvas to be drawn
            // This option is supported since echarts-wordcloud@2.1.0
            drawOutOfBound: false,

            // if the font size is too large for the text to be displayed,
            // whether to shrink the text. If it is set to false, the text will
            // not be rendered. If it is set to true, the text will be shrinked.
            // This option is supported since echarts-wordcloud@2.1.0
            shrinkToFit: false,

            // If perform layout animation.
            // NOTE disable it will lead to UI blocking when there is lots of words.
            layoutAnimation: true,

            // Global text style
            // 文字样式
            textStyle: {
              fontFamily: 'sans-serif',
              fontWeight: 'bold',
              // Color can be a callback function or a color string
              color: function() {
                // Random color
                return (
                  'rgb(' +
                  [
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160),
                    Math.round(Math.random() * 160)
                  ].join(',') +
                  ')'
                )
              }
            },
            // 文字高亮
            emphasis: {
              focus: 'self',

              textStyle: {
                textShadowBlur: 10,
                textShadowColor: '#333'
              }
            },

            // 渲染的数据 必须要有name和value
            data: [
              {
                name: '蔡徐坤',
                value: 1
              },
              {
                name: '范丞丞',
                value: 2
              },
              {
                name: '陈立农',
                value: 3
              },
              {
                name: '无一凡',
                value: 4

              },
              {
                name: '李一封',
                value: 5

              },
              {
                name: '姿态',
                value: 6
              },
              {
                name: '姿态er',
                value: 7
              },
              {
                name: 'letme',
                value: 8
              }
            ]
          }
        ]
      }
      wordEchart.setOption(option)
    }
  }
}
</script>
<style lang="scss" scoped>
.word-main{
  width: 100%;
  height: 100%;
  #word-echart{
  width: 100%;
  height: 100%;
  }
}
</style>
