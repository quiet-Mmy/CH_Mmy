<template>
  <div class="main">
    <el-card shadow="never" class="margin-30 pad">
      <div slot="header">
        <el-upload
          ref="upload"
          action="/lejuAdmin/material/uploadFileOssSave"
          :on-success="handlerImgSuccess"
          :headers="token"
          :before-upload="beforeCoverImgUpload"
        >
          <el-button slot="trigger" size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">只能上传jpg/png/webp文件，且不超过1.5M</div>
        </el-upload>

      </div>
      <!-- 每一个小卡片 -->
      <el-row :gutter="20">
        <el-col v-for="item in list" :key="item.id" :offset="0" style="width: 20%;margin-bottom: 20px;">
          <el-card shadow="never">
            <div slot="header">
              <span>创建时间：{{ item.createTime }}</span>
            </div>
            <el-image
              style="width: 245px; height: 200px"
              :src="item.ossUrl"
              :preview-src-list="srcList"
            />
            <el-button style="margin-left: 190px;margin-top: 10px;" type="danger" size="mini" @click="delte(item.id)">删除</el-button>
          </el-card>
        </el-col>
      </el-row>

    </el-card>
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
  </div>
</template>

<script>
import { findMaterialByPage, delMaterial } from '@/api/comtent/material/index'
import mix from '@/mixins/index'
export default {
  // 当前页面的name
  name: '',
  mixins: [mix],
  data() {
    return {
      list: []
    }
  },
  computed: {
    srcList() {
      return this.list.map(item => item.ossUrl)
    }
  },
  created() {
    this.findMaterialByPage()
  },
  mounted() {},

  methods: {
    // 获取素材列表
    async findMaterialByPage() {
      const res = await findMaterialByPage(this.pagination.start, this.pagination.limit)
      console.log(res)
      const { success, data, message } = res
      if (success) {
        this.list = res.data.rows
        this.pagination.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    // // limit 分页发生变化
    handleSizeChange(val) {
      console.log(`每页 ${val} 条`)
      this.pagination.start = 1
      this.pagination.limit = val
      this.findMaterialByPage()
    },

    // // start 分页发生变化
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pagination.start = val
      this.findMaterialByPage()
    },
    // 图片上传成功之后  自带参数res成功的参数信息
    handlerImgSuccess(res) {
      const { success, message } = res
      if (success) {
        // 上传成功后 刷新列表数据
        this.findMaterialByPage()
        // 清除上传的文件列表
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error(message)
      }
    },
    // 删除当前的图片素材
    delte(id) {
      this.$confirm('此操作将永久删除该素材, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delMaterial(id)
        const { success, message } = res
        if (success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          // 上传成功后 刷新列表数据
          this.findMaterialByPage()
        } else {
          this.$message.error(message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    // 上传图片之前触发
    beforeCoverImgUpload(file) {
      // file 拿到的是图片信息
      console.log(file)
      const isLt1dotM = file.size / 1024 / 1024 < 1.5

      // 上传之前使用正则校验大小
      const reg = /^image\/(jpeg|jpg|png|webp)$/
      const isImg = reg.test(file.type)

      if (!isImg) {
        this.$message.error('上传头像图片只能是 jpeg|jpg|png|webp 格式!')
      }
      if (!isLt1dotM) {
        this.$message.error('上传头像图片大小不能超过 1.5MB!')
      }
      return isImg && isLt1dotM
    }
  }
}
</script>

<style scoped>
.pad{
  margin: 20px;
}
</style>
