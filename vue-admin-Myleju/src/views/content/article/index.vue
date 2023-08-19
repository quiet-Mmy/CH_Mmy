<template>
  <div class="article">
    <!-- 设置阴影不显示 shadow = 'never' -->
    <el-card shadow="never">
      <div slot="header" class="clearfix">
        <span>条件查询</span>
      </div>
      <!-- 卡片内容 表单 -->
      <el-form ref="form" :model="form" label-width="80px" size="mini">
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <el-form-item label="作者">
              <el-input v-model="form.author" placeholder="作者" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="标题">
              <el-input v-model="form.title" placeholder="标题" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="编辑类型">
              <!-- 设置编辑器类型  0 富文本  1 mdn       clearable 可以设置后面有X号 清除内容-->
              <el-select
                v-model="form.editorType"
                style="width: 100%"
                clearable
                placeholder="编辑类型"
              >
                <!-- 0是富文本 1是md -->
                <el-option label="富文本" value="0" />
                <el-option label="markdown" value="1" />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="18">
            <el-form-item>
              <el-button @click="resetForm">重置</el-button>
              <el-button type="primary" @click="goSeach">搜索</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>

    <!-- 下面的表格 -->
    <el-card shadow="never" class="margin-30">
      <div slot="header">
        <el-button
          type="primary"
          plain
          size="mini"
          @click="AddArticle"
        >新增</el-button>
      </div>
      <!-- stripe 添加斑马纹  鼠标放上去会显示 -->
      <el-table
        v-loading="loading"
        element-loading-text="拼命加载中"
        element-loading-spinner="el-icon-loading"
        element-loading-background="rgba(0, 0, 0, 0.8)"
        :data="articleList"
        style="width: 100%"
        stripe
        border
      >
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column
          prop="title"
          label="文章标题"
          width="180"
          align="center"
        />
        <el-table-column label="展示图片" width="160" align="center">
          <template slot-scope="scope">
            <!-- 这里的scope.row 代表当前行 代表着每一条数据 -->
            <img width="100" height="100" :src="scope.row.coverImg" alt="">
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="添加时间" align="center" />
        <el-table-column prop="author" label="文章作者" align="center" />

        <el-table-column label="文章是否展示" align="center">
          <template slot-scope="scope">
            <el-switch
              v-model="scope.row.isShow"
              active-color="#409eff"
              inactive-color="#dcdfe6"
              :active-value="1"
              :inactive-value="0"
              @change="setShowStatus(scope.row.isShow, scope.row.id)"
            />
          </template>
        </el-table-column>

        <el-table-column label="编辑器类型" align="center">
          <template slot-scope="scope">
            <!-- plain朴素按钮 -->
            <el-button
              v-if="scope.row.editorType === 0"
              disabled
              type="primary"
              size="mini"
              plain
            >富文本</el-button>
            <el-button
              v-if="scope.row.editorType === 1"
              disabled
              type="primary"
              size="mini"
              plain
            >mackdown</el-button>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="mini"
              @click="editActicle(scope.row.id)"
            >
              <i class="el-icon-view" />
              编辑文章
            </el-button>
            <el-button
              type="text"
              size="mini"
              style="color: red"
              @click="delArticle(scope.row.id)"
            >删除</el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination
        class="margin-30"
        style="text-align: center"
        :current-page="pagination.start"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </el-card>
  </div>
</template>
<script>
// 导入 查找文章列表   更新文章显示状态   删除当前文章
import {
  findArticles,
  changeShowStatus,
  delThisArticle
} from '@/api/comtent/article'
import { filterNUllStr } from '@/utils/index'

import mix from '@/mixins/index'
export default {
  // 当前页面的name
  name: 'Article',
  mixins: [mix],
  data() {
    return {
      // 接收   搜索框里面 动态添加的值
      form: {},
      // 设置加载时候的loading状态
      loading: 'false',

      // start: 1,
      // limit: 10,
      // pageSizes: [10, 20, 30, 40],
      // // 总页数
      // total: 0,

      // 文章列表
      articleList: []

    }
  },
  created() {
    this.getArticleList()
  },
  mounted() {},
  methods: {
    // 点击重置
    resetForm() {
      // 拿到data里面的form 初始值
      this.pagination.start = 1
      this.form = this.$options.data().form
      this.getArticleList()
    },
    // 点击根据条件搜索
    goSeach() {
      // 每次搜索都让他跳转到第一页
      this.pagination.start = 1
      this.getArticleList()
    },

    // 获取文章列表
    async getArticleList() {
      // 开启loading
      this.loading = true

      // 封装的过滤空对象的方法  直接把form传进去过滤一下  接收返回一个过滤后的对象
      const params = filterNUllStr(this.form)
      // const res = await findArticles(this.start, this.limit, params)
      const res = await findArticles(this.pagination.start, this.pagination.limit, params)
      console.log(res)
      const { success, data, message } = res
      if (success) {
        const { rows, total } = data
        // 设置当前的文章 列表   和 总页数
        this.articleList = rows
        this.pagination.total = total
      } else {
        this.$message.error(message)
      }
      // 关闭loading
      this.loading = false
    },

    // 去新增文章
    AddArticle() {
      // 这里使用的是name 来跳转 如果是路由的  还需要把路径写完整
      // this.$router.push('/content/addArticle')
      this.$router.push({ name: 'addArticle' })
    },
    // 点击编辑文章
    editActicle(id) {
      this.$router.push({ name: 'EditArticle', params: { id }})
    },

    // 更新文章显示状态
    async setShowStatus(isShow, id) {
      const res = await changeShowStatus({ isShow, id })
      const { success, message } = res
      if (success) {
        this.$message({
          message: '修改状态成功',
          type: 'success'
        })
      } else {
        this.$message.error(message)
      }
    },

    // 删除当前文章
    async delArticle(id) {
      // 删除的时候不可逆转 所以需要用户点击确定才可以删除
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async() => {
          const res = await delThisArticle(id)
          if (res.success) {
            this.$message.success('删除当前文章成功')
            // 删除成功之后再刷新一遍文章列表
            this.getArticleList()
          } else {
            this.$message.error(res.message)
          }
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          })
        })
    },

    // // limit 分页发生变化
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagination.start = 1
      this.pagination.limit = val
      this.getArticleList()
    },

    // // start 分页发生变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagination.start = val
      this.getArticleList()
    }
  }
}
</script>
//可以设置代码为scss  lang='scss'
<style lang="scss" scoped>
.article {
  padding: 30px;
}
.article {
  ::v-deep .el-form-item__label {
    font-weight: normal;
  }
}
</style>
