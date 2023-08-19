<template>
  <div class="user-main">
    <!-- loading -->
    <dv-loading v-if="loading" style="width: 100%;height: 100%;">Loading...</dv-loading>

    <div v-if="!loading">
      <!-- 头部 -->
      <el-card shadow="never" class="margin">
        <el-form ref="form" :model="userQueryVo" label-width="80px" size="mini">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="昵称">
                <el-input v-model="userQueryVo.nickName" placeholder="昵称模糊搜索" />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="用户名">
                <el-input v-model="userQueryVo.username" placeholder="用户名模糊搜索" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12" :offset="16">
              <el-form-item>
                <el-button @click="resect">重置</el-button>
                <el-button type="primary" @click="onSeach">查询</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-card>

      <!-- 内容 -->
      <el-card shadow="never" class="margin">
        <div slot="header">
          <el-button type="primary" size="mini" @click="addUser">新增</el-button>
        </div>
        <el-table :data="UserList" border stripe style="margin-bottom: 20px;">
          <el-table-column
            label="#"
            type="index"
            fixed="left"
            width="50"
            align="center"
          />
          <el-table-column
            label="用户名"
            width="200px"
            align="center"
            prop="username"
          />
          <el-table-column
            label="昵称"
            width="200px"
            align="center"
            prop="nick_name"
          />
          <el-table-column
            label="头像"
            width="200px"
            align="center"
          >
            <template slot-scope="scope">
              <img style="width: 100px;height: 100px;" :src="scope.row.salt" alt="">
            </template>
          </el-table-column>

          <el-table-column
            label="角色"
            align="center"
            prop="roles"
          />

          <el-table-column
            label="添加时间"
            align="center"
            width="200px"
            prop="create_time"
          />

          <el-table-column
            label="操作"
            align="center"
            width="200px"
          >
            <template slot-scope="scope">
              <el-button type="success" size="mini" @click="editUser(scope.row.id)">编辑</el-button>
              <el-button type="danger" size="mini" @click="delUser(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <!-- 分页器 -->
        <el-row :gutter="20">
          <el-col :span="12" :offset="18">
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
          </el-col>
        </el-row>
      </el-card>

      <!-- 对话窗 -->
      <el-dialog
        :title="userId?'编辑用户':'新增用户'"
        :visible.sync="dialogVisible"
        width="30%"
        @close="handleEvent"
      >
        <el-form ref="userDetail" :model="userDetailForm" :rules="rules" label-width="80px" :inline="false" size="normal">
          <el-form-item label="用户名" prop="roleIds">
            <el-input v-model="userDetailForm.username" size="mini" />
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickName">
            <el-input v-model="userDetailForm.nickName" size="mini" />
          </el-form-item>
          <el-form-item v-if="!userId" label="密码">
            <el-input v-model="userDetailForm.password" type="password" size="mini" />
          </el-form-item>
          <el-form-item label="用户头像">
            <el-upload
              ref="upload"
              class="avatar-uploader"
              :action="uploadFile"
              :headers="token"
              :on-success="handleSkuPicSuccess"
              :before-upload="beforeSkuPicUpload"
            >
              <img width="40" height="40" :src="userDetailForm.salt" alt="">
            </el-upload>
          </el-form-item>

          <el-form-item label="选择角色">
            <el-select
              v-model="SelectRoles"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请选择"
              size="mini"
            >
              <el-option
                v-for="item in Allroles"
                :key="item.id"
                :label="item.roleName"
                :value="item.id"
              />
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-row :gutter="20">
              <el-col :span="12" :offset="15">
                <el-button size="mini" @click="cancellation">取 消</el-button>
                <el-button size="mini" type="primary" @click="addOrEditUser">确 定</el-button>
              </el-col>
            </el-row>

          </el-form-item>
        </el-form>
      </el-dialog>

    </div>
  </div>
</template>
<script>
// 混入mixins
import mix from '@/mixins/index'
// 导入请求
import { findUsersByPage, findAllRoles, removeUser, saveUserRoles, updateUserRoles } from '@/api/Authority/userIndex'
export default {
// 当前页面的name
  name: 'User',
  mixins: [mix],
  data() {
    return {
      userDetailForm: {
        salt: require('@/icons/avatar.png')
      }, // 对话框from
      SelectRoles: [], // 对话框的角色选择
      loading: true, // +载loading
      dialogVisible: false, // 设置对话窗
      userId: '', // 判断当前是编辑还是新增
      UserList: [], // 用户列表
      Allroles: [], // 全部的角色
      userQueryVo: {
        nickName: '',
        username: ''
      }, // 表单搜索的参数
      rules: {}
    }
  },
  created() {
  },
  mounted() {
    this.getUserList()// 获取用户列表
    this.getAllRoles()// 获取全部的角色
  },
  methods: {
    // 获取用户列表
    async getUserList() {
      this.loading = true
      const res = await findUsersByPage(this.pagination.start, this.pagination.limit)
      console.log('用户列表', res)
      const { success, data, message } = res
      if (success) {
        this.UserList = data.rows
        this.pagination.total = data.total
      } else {
        this.$message.error(message)
      }
      this.loading = false
    },
    // 获取全部的角色列表
    async getAllRoles() {
      const res = await findAllRoles()
      const { success, data, message } = res
      console.log(res)
      if (success) {
        this.Allroles = data.items
      } else {
        this.$message.error(message)
      }
    },
    // 点击编辑   根据id 回显详情 对话框关闭后 清除数据id！！！
    editUser(id) {
      this.userId = id
      this.dialogVisible = true
      this.userDetailForm = this.UserList.find(item => item.id === id) // 设置回显的值
      this.userDetailForm.nickName = this.userDetailForm.nick_name // 设置回显昵称字段
      if (this.userDetailForm.roles) {
        const sel = this.userDetailForm.roles.split(',')// 设置下拉选择框值 ['name','name']
        const arr = []
        this.Allroles.forEach(item => {
          sel.forEach((i) => {
            if (item.roleName === i) {
              arr.push(item.id)
            }
          })
        })
        this.SelectRoles = arr// 设置下拉选择框值
      }
    },
    // 点击新增用户账号
    addUser() {
      this.dialogVisible = true
    },
    // 对话框点击确定
    async addOrEditUser() {
      this.userDetailForm.isDeleted = false // 添加逻辑删除
      this.userDetailForm.roleIds = this.SelectRoles // 添加上传 下拉选择框值
      this.userDetailForm.id = this.userId ? this.userId : '' // 更新的时候需要id值  如果没有就传的空

      // 还需要把 SelectRoles 从角色数组中遍历取出来 find 返回满足条件的元素
      console.log('参数信息==>', this.userDetailForm)
      const api = this.userId ? updateUserRoles : saveUserRoles
      const res = await api(this.userDetailForm)
      console.log(res)

      const { success, message } = res
      if (success) {
        // 成功之后关闭对话窗
        this.dialogVisible = false
        this.$message.success(this.userId ? '更新成功' : '编辑成功')
        // 刷新列表
        this.getUserList()
      } else {
        this.$message.error(message)
      }
    },
    // 对话框点击取消
    cancellation() {
      this.dialogVisible = false
    },
    // 对话窗改为false 就会触发
    handleEvent() {
      this.dialogVisible = false
      this.resectList()
    },
    // 对话框关闭后清除对话框数据
    resectList() {
      this.userDetailForm = this.$options.data().userDetailForm
      this.SelectRoles = this.$options.data().SelectRoles
      this.userId = ''
    },
    // 点击删除
    delUser(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await removeUser(id)
        const { success, message } = res
        if (success) {
          this.$message.success('删除成功')
          // 删除成功 刷新列表
          this.getUserList()
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
    // 上传头像图片 成功
    handleSkuPicSuccess(res) {
      const { success, data, message } = res
      console.log(res)
      if (success) {
        // 赋值图片
        this.userDetailForm.salt = data.fileUrl

        // 上传完成之后 调用实例上的方法    去掉上传的文件列表clearFiles()
        this.$refs.upload.clearFiles()
      } else {
        this.$message.error(message)
      }
    },
    // 上传skuPic图片上传之前校验
    beforeSkuPicUpload(file) {
      // this.checkImg(file) 混入在mix的校验图片的方法
      return this.checkImg(file)
    },
    // limit发生改变
    sizeChange(val) {
      this.pagination.limit = val
      this.pagination.start = 1
      this.getUserList()
    },
    // 当前页码变化
    currentChange(val) {
      this.pagination.start = val
      this.getUserList()
    },
    // 点击条件搜索
    onSeach() {
      this.getUserList()
    },
    // 点击重置表单
    resect() {
      this.userQueryVo = this.$options.data().userQueryVo
      this.getUserList()
    }
  }
}
</script>
<style scoped lang='scss'>
.user-main{
  width: 100%;
}
.margin{
  margin: 20px;
}
</style>
