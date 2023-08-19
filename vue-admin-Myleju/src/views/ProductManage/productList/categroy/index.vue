<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span>分类管理:</span>
      </div>
      <h4>乐居分类</h4>
      <el-row :gutter="20">
        <el-col v-for="item in lejuCategory" :key="item.id" :span="6" :offset="0">
          <el-card shadow="never">
            <div slot="header">
              <span>{{ item.name }}</span>
            </div>
            <!-- 通用素材上传接口   上传完成后 需要调用更新分类接口  -->
            <!-- level (integer, optional): 分类级别：0->1级；1->2级 ,  修改的是2级乐居分类     -->
            <el-upload
              ref="uploadS"
              :show-file-list="false"
              :action="uploadFile"
              :on-success="handlerImgSuccess"
              :headers="token"
              :before-upload="beforeCoverImgUpload"
              @click.native="ClickCroy(item.id)"
            >
              <el-image :src="item.icon" style="width: 100%; height: 300px;" />
            </el-upload>
          </el-card>
        </el-col>
      </el-row>

      <h4>全部分类</h4>
      <el-table :data="careGroyList" border stripe row-key="id">
        <el-table-column
          label="菜单名称"
          prop="name"
          width="150px"
          align="center"
        />
        <el-table-column
          label="icon"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            <img width="60px" height="60px" :src="scope.row.icon" alt="">
          </template>
        </el-table-column>
        <el-table-column
          label="分类名字"
          prop="keywords"
          width="180px"
          align="center"
        />
        <el-table-column
          label="排序"
          prop="sort"
          width="150px"
          align="center"
        />

        <el-table-column
          label="显示状态"
          width="150px"
          align="center"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.showStatus===1?'显示':'不显示' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="导航栏显示状态"
          align="center"
          width="150px"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.navStatus===1?'显示':'不显示' }}</span>
          </template>
        </el-table-column>

        <el-table-column
          label="描述"
          align="center"
          prop="description"
        />

        <el-table-column
          label="创建时间"
          align="center"
          width="180px"
          prop="createTime"
        />
      </el-table>

    </el-card>

  </div>
</template>
<script>
import { getAllCategory, updateCategory } from '@/api/product/categroy'
import mix from '@/mixins/index'
export default {
// 当前页面的name
  name: 'ProductCateGroy',
  mixins: [mix],
  data() {
    return {
      lejuCategory: [], // 乐居分类
      careGroyList: [], // 全部分类
      cutId: '' // 当前上传那个图片的id
    }
  },
  created() {
    this.getCategroyAll()
  },
  mounted() {

  },
  methods: {
    /**
     * 获取全部分类 get
     */
    async getCategroyAll() {
      this.lejuCategory = [] // 清空数组
      this.careGroyList = [] // 清空数组
      const res = await getAllCategory()
      console.log(res)
      const { success, data, message } = res
      if (success) {
        // 获取乐居分类
        this.lejuCategory = data.items.find(item => item.category.name === '乐居').children

        console.log(this.lejuCategory)

        // 设置全部分类的格式 需要放在同一个对象里面
        data.items.forEach(item => {
          this.careGroyList.push({
            ...item.category,
            children: item.children
          })
        })
      } else {
        this.$message.error(message)
      }
    },
    // 这里接收点击上传图片时候的id
    ClickCroy(id) {
      this.cutId = id
    },
    // 分类图片上传成功之后  自带参数res成功的参数信息
    async handlerImgSuccess(res) {
      const { success, data, message } = res
      console.log('分类图片上传', data.fileUrl)
      if (success) {
        try {
          // 遍历出当前要修改的分类
          const currentCategroy = this.lejuCategory.find(item => {
            return item.id === this.cutId
          })
          console.log('当前要修改的item分类==>>', currentCategroy)
          // debugger
          // 修改更新时候要上传的参数
          currentCategroy.icon = data.fileUrl
          currentCategroy.level = 1
          currentCategroy.showStatus = 1
          const list = await updateCategory(currentCategroy)
          const { success, message } = list
          if (success) {
            this.getCategroyAll() // 上传成功后 刷新列表数据   需要更新数据
          } else {
            this.$message.error(message)
          }
        } catch (error) {
          console.log('捕获错误', error)
        }
      } else {
        this.$message.error(message)
      }
    },
    // 上传分类图片之前触发
    beforeCoverImgUpload(file) {
      // mixins里面的校验图片方法
      this.checkImg(file)
    }

  }
}
</script>

<style scoped lang='scss'>
.el-card {
  margin: 20px;
}
</style>
