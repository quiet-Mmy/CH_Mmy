<template>
  <div>
    <el-card class="margin" shadow="never">
      <div slot="header">
        <el-button type="primary" size="mini" @click="EditProduct()">新增</el-button>
      </div>
      <!-- 表格 -->
      <el-table v-loading="loading" :data="productList" border stripe>
        <el-table-column
          fixed="left"
          type="index"
          label="序号"
          width="50"
        />
        <el-table-column
          label="品牌名称"
          prop="name"
        />
        <el-table-column
          label="展示状态"
        >
          <template slot-scope="scope">
            <el-switch v-model="scope.row.showStatus" :active-value="1" :inactive-value="0" @change="ShowProduct(scope.row.showStatus,scope.row.id)" />
          </template>
        </el-table-column>

        <el-table-column
          label="Logo"
        >
          <template slot-scope="scope">
            <el-image style="width: 50px;height: 50px;" :src="scope.row.logo" fit="fill" :lazy="true" />
          </template>
        </el-table-column>

        <el-table-column
          label="专区大图"
        >
          <template slot-scope="scope">
            <el-image style="width: 50px;height: 50px;" :src="scope.row.bigPic" fit="fill" :lazy="true" />
          </template>
        </el-table-column>

        <el-table-column
          label="品牌故事"
          prop="brandStory"
        />

        <el-table-column
          label="创建时间"
          width="200"
          prop="createTime"
        />
        <el-table-column
          label="排序"
          width="200"
          prop="sort"
        />
        <el-table-column
          label="产品评论数量"
          prop="productCommentCount"
        />
        <el-table-column
          label="操作"
        >
          <template slot-scope="scope">
            <el-button type="text" size="default" @click="EditProduct(scope.row.id)"> 编辑</el-button>
            <el-button type="text" size="default" style="color:red;" @click="DelProduct(scope.row.id)"> 删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        :current-page.sync="pagination.start"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        background
        @size-change="sizeChange"
        @current-change="currentChange"
      />
      <!-- 对话窗 -->
      <el-dialog
        title="品牌详情"
        :visible.sync="dialogVisible"
        width="65%"
        @close="handleEvent"
      >
        <el-form ref="form" :model="productDetail" :rules="rules" label-width="130px" :inline="false" size="normal">
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="品牌名称" prop="name">
                <el-input v-model="productDetail.name" size="mini" placeholder="品牌名称" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="3">
              <el-form-item label="首字母">
                <el-input v-model="productDetail.firstLetter" size="mini" placeholder="首字母" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="排序">
                <el-input v-model="productDetail.sort" size="mini" placeholder="排序" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="3">
              <el-form-item label="产品数量">
                <el-input v-model="productDetail.productCount" size="mini" placeholder="产品数量" />
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="是否展示">
                <el-switch v-model="productDetail.showStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="8" :offset="3">
              <el-form-item label="是否为品牌制造商">
                <el-switch v-model="productDetail.factoryStatus" size="mini" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10" :offset="0">
              <el-form-item label="上传专区大图">
                <el-upload
                  ref="upload"
                  class="avatar-uploader"
                  :headers="token"
                  :action="uploadFile"
                  :on-success="uploadSuc"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="fileUrl" :src="fileUrl" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>

            <el-col :span="10" :offset="1">
              <el-form-item label="上传Logo大图">
                <el-upload
                  ref="uploadLogo"
                  class="avatar-uploader"
                  :headers="token"
                  :action="uploadFile"
                  :on-success="uploadLogo"
                  :before-upload="beforeAvatarUpload"
                >
                  <img v-if="FupLogo" :src="FupLogo" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 点击确认 -->
          <el-row :gutter="20">
            <el-col :span="10" :offset="18">
              <el-form-item>
                <el-button @click="exit">取 消</el-button>
                <el-button type="primary" @click="OkAddOrEdit">确 定</el-button>
              </el-form-item>
            </el-col>
          </el-row>

        </el-form>
      </el-dialog>
    </el-card>

  </div>
</template>
<script>
import { findBrandByPage, switchShowStatus, delBrand, addBrand, updateBrand } from '@/api/product/productMain/index'
import mix from '@/mixins/index'
export default {
// 当前页面的name
  name: 'ProductMain',
  mixins: [mix],
  data() {
    return {
      loading: false,
      dialogVisible: false, // 新增对话框
      productList: [], // 品牌列表
      productDetail: {}, // 品牌详情
      rules: {
        name: [{ required: true, message: '品牌名称必须填', tigger: 'blur' }]
      }, // 品牌详情正则
      fileUrl: '', // 上传后专区的图片
      FupLogo: '', // 上传logo的图片
      addProductId: ''// 上传的id
    }
  },
  created() {
    this.getProduct()// 获取品牌
  },

  methods: {
    /**
     * 获取品牌
     */
    async getProduct() {
      // 根据分页获取
      this.loading = true
      const res = await findBrandByPage(this.pagination.start, this.pagination.limit)
      const { success, data, message } = res
      if (success) {
        this.productList = data.rows
        this.pagination.total = data.total
      } else {
        this.$message.error(message)
      }
      this.loading = false
    },

    /**
     * 对话窗 点击新增 或者 更新  如果name不存在那就是新增 如果存在就是更新  更新需要传id
     */
    async OkAddOrEdit() {
      const stu = this.productList.find(item => item.id === this.addProductId)
      const api = stu ? updateBrand : addBrand
      this.filetProduct()// 过滤参数信息
      const res = await api(this.productDetail)
      const { success, message } = res
      if (success) {
        this.getProduct()// 刷新列表
        this.$message.success('成功')
      } else {
        this.$message.error(message)
      }
      this.dialogVisible = false // 关闭弹窗
    },
    // 点击新增的时候 过滤一下参数
    filetProduct() {
      this.productDetail.id = this.addProductId
      this.productDetail.bigPic = this.fileUrl
      this.productDetail.logo = this.FupLogo
      this.productDetail.productCommentCount = Math.floor(Math.random() * 1000)
      this.productDetail.brandStory = 'He said youre not gentle enough'
    },
    // 点击编辑当前的品牌  通过id查找到这条数据回显
    EditProduct(id) {
      if (id) {
        const arr = this.productList
          .find(item => item.id === id)
        this.productDetail = arr
        this.fileUrl = arr.bigPic
        this.FupLogo = arr.logo
        this.addProductId = id
      } else {
        // 这一步可以省
        this.productDetail = {}
      }
      this.dialogVisible = true
    },
    // 对话框点击取消
    exit() {
      this.dialogVisible = false
    },
    // handleEvent 对话框关闭触发的函数
    handleEvent() {
      this.resectFrom()
    },
    // 重置对话框
    resectFrom() {
      // 点击取消的时候需要把他的图片变为空
      this.productDetail = this.$options.data().productDetail
      this.fileUrl = this.$options.data().fileUrl
      this.FupLogo = this.$options.data().FupLogo
      this.addProductId = this.$options.data().addProductId
    },
    // 品牌图片上传成功
    uploadSuc(file) {
      this.$refs.upload.clearFiles()// 清除上传文件历史
      // console.log('上传成功file', file.data.fileUrl)
      this.fileUrl = file.data.fileUrl
    },
    // logo图片上传成功
    uploadLogo(file) {
      this.$refs.uploadLogo.clearFiles()// 清除上传文件历史
      console.log('上传logo成功file', file)
      this.FupLogo = file.data.fileUrl
    },
    // 上传之前校验
    beforeAvatarUpload(file) {
      this.checkImg(file)// 调用mixins里面的图片校验
    },
    // 点击切换当前品牌展示
    async ShowProduct(status, id) {
      console.log(status, id)
      const res = await switchShowStatus({ id, status })
      if (res.success) {
        this.$message({
          type: 'success',
          message: '切换成功!'
        })
      }
    },
    // 点击删除当前品牌
    DelProduct(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delBrand(id)
        const { success, message } = res
        if (success) {
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
          this.getProduct()// 刷新品牌列表
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
    // limit发生改变
    sizeChange(val) {
      this.pagination.limit = val
      this.pagination.start = 1
      this.getProduct()// 获取品牌
    },
    // 当前页码变化
    currentChange(val) {
      this.pagination.start = val
      this.getProduct()// 获取品牌
    }
  }
}
</script>
<style scoped lang='scss'>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 200px;
    height: 200px;
    display: block;
  }
  ::v-deep .el-form-item{
    margin-bottom: 10px;
  }
</style>
