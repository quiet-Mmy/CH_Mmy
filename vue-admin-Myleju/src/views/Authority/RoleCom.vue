<template>
  <div class="role">
    <el-card shadow="never" class="margin">
      <div slot="header">
        <el-button type="primary" size="mini" @click="addRole">新增角色</el-button>
      </div>
      <el-table :data="roleList" border stripe size="mini">
        <el-table-column
          type="index"
          label="#"
          width="50"
          align="center"
        />
        <el-table-column
          label="角色名称"
          width="200"
          align="center"
          prop="roleName"
        />
        <el-table-column
          label="角色编码"
          width="200"
          align="center"
          prop="roleCode"
        />
        <el-table-column
          label="备注"
          align="center"
          prop="remark"
        />
        <el-table-column
          label="添加时间"
          width="200"
          align="center"
          prop="createTime"
        />
        <el-table-column
          label="操作"
          align="center"
          width="300px"
        >
          <template slot-scope="scope">
            <el-button type="success" size="mini" @click="editRoles(scope.row.id)">编辑</el-button>
            <el-button size="mini" @click="delRoles(scope.row.id)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-row :gutter="20" class="margin-30">
        <el-col :span="12" :offset="15">
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
      :title="RolesId?'编辑角色':'新增角色'"
      :visible.sync="dialogVisible"
      width="30%"
      @close="handleEvent"
    >
      <el-form ref="RolesDetail" :model="RolesDetailForm" :rules="rules" label-width="80px" :inline="false" size="normal">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="RolesDetailForm.roleName" size="mini" />
        </el-form-item>
        <el-form-item label="用户编码">
          <el-input v-model="RolesDetailForm.roleCode" size="mini" />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="RolesDetailForm.remark"
            size="mini"
            type="textarea"
            :rows="2"
          />
        </el-form-item>
        <!-- 选择菜单 必须添加node-key 来表示该字段是唯一的 -->
        <el-form-item label="选择菜单">
          <el-row :gutter="20">
            <el-col :span="12" :offset="0">
              <el-checkbox :indeterminate="false" @change="openOrClose">展开/关闭</el-checkbox>
              <el-checkbox :indeterminate="false" @change="AllCheck">全选/取消权限</el-checkbox>
            </el-col>
          </el-row>

          <el-tree
            ref="Tree"
            :data="MenuS"
            show-checkbox
            node-key="id"
            :default-expanded-keys="[2, 3]"
            :default-checked-keys="[5]"
            :props="defaultProps"
          />
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
</template>
<script>
import { findrolesList, removeRole, findRolePermissions, findAllMenus, saveRolePermissions, updateRolePermissions } from '@/api/Authority/roleIndex'
import mix from '@/mixins/index'
export default {
// 当前页面的name
  name: 'Role',
  mixins: [mix],
  data() {
    return {
      roleList: [], // 角色信息列表
      RolesId: '', // 临时的id 用于判断当前是编辑还是更新
      dialogVisible: false, // 设置对话窗
      RolesDetailForm: {}, // 对话窗的值
      rules: {},

      MenuS: [], // 菜单列表
      MenuIds: [], // 菜单id
      // 设置对话框的树节点  如果字段不是children 用哪一个属性代替代替
      defaultProps: {
        children: 'children',
        label: 'title'
      }
    }
  },
  created() {
    this.getRolesList()// 获取角色信息列表
    this.getfindAllMenus()// 获取全部权限列表
  },

  methods: {
    // 获取角色信息
    async getRolesList() {
      const res = await findrolesList(this.pagination.start, this.pagination.limit)
      console.log('角色信息', res)
      const { success, data, message } = res
      if (success) {
        this.roleList = data.rows
        this.pagination.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    // 获取全部权限列表
    async getfindAllMenus() {
      const res = await findAllMenus()
      // console.log('菜单', res)
      const { success, data, message } = res
      if (success) {
        this.MenuS = data.permissionList
      } else {
        this.$message.error(message)
      }
    },
    // 点击新增角色
    addRole() {
      this.dialogVisible = true
    },
    // 点击编辑弹出对话窗   回显数据 根据id
    async editRoles(id) {
      this.RolesId = id
      this.dialogVisible = true// 开启对话窗
      const res = await findRolePermissions(this.RolesId)
      console.log('角色详细信息', res)
      const { success, data, message } = res
      if (success) {
        this.RolesDetailForm = data.role

        // 判断 如果他的权限存在 且大于0  就给他添加回显
        if (this.RolesDetailForm.permissionIds && this.RolesDetailForm.permissionIds.length > 0) {
          this.$refs.Tree.setCheckedKeys(this.RolesDetailForm.permissionIds)
        }
      } else {
        this.$message.error(message)
      }
    },
    // 对话框点击确定
    async addOrEditUser() {
      const checkKeys = this.$refs.Tree.getCheckedKeys() // 通过他实例上的方法 getCheckedKeys 获取他当前选中的keys的id集合
      this.RolesDetailForm.permissionIds = checkKeys // 当前选中的权限id集合
      this.RolesDetailForm.isDeleted = 0// 逻辑删除？ 1（true）已删除， 0（false）未删除 ,
      this.RolesDetailForm.id = this.RolesId ? this.RolesId : ''// 如果有id 就给他添加上 如果没有就添加''
      console.log('调用接口更新的数据', this.RolesDetailForm)
      const api = this.RolesId ? updateRolePermissions : saveRolePermissions
      const res = await api(this.RolesDetailForm)
      console.log(res)

      const { success, message } = res
      if (success) {
        // 成功之后关闭对话窗
        this.dialogVisible = false
        this.$message.success(this.RolesId ? '更新成功' : '编辑成功')
        // 刷新列表
        this.pagination.start = 1
        this.getRolesList()
      } else {
        this.$message.error(message)
      }
    },
    // 点击展开/关闭
    openOrClose(e) {
      const nodesmap = this.$refs.Tree.store.nodesMap
      // 这里拿到的是一个对象
      for (const key in nodesmap) {
        const item = nodesmap[key]
        item.expanded = e
      }
    },
    // 点击全选
    AllCheck(e) {
      // 1 直接操作他属性上的方法  改变checked状态
      // const nodesmap = this.$refs.Tree.store.nodesMap
      // for (const key in nodesmap) {
      //   const item = nodesmap[key]
      //   item.checked = e
      // }

      // 2 调用他本身自带的方法 (keys, leafOnly) 接收两个参数  keys勾选节点的keys数组 leafOnly状态boolean值
      if (e) {
        // 全选
        this.getAllcheckedId(this.MenuS)// 这个方法筛选出了所有的菜单id
        this.$refs.Tree.setCheckedKeys(this.MenuIds) // 接收一个keys数组
      } else {
        // 取消全选
        this.MenuIds = []
        this.$refs.Tree.setCheckedKeys(this.MenuIds)
      }
    },
    // 获取所有的菜单id
    getAllcheckedId(MenuList) {
      for (let i = 0; i < MenuList.length; i++) {
        const item = MenuList[i]
        // 把他当前的每一项的取出来  他的id值  放到了menuIds里面[ ]
        this.MenuIds.push(item.id)
        // 判断如果有children 再次调用自身 利用递归
        if (item.children && item.children.length > 0) {
          this.getAllcheckedId(item.children)
        }
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
      this.RolesId = ''
      this.RolesDetailForm = this.$options.data().RolesDetailForm
      // 取消全选
      this.MenuIds = []
      this.$refs.Tree.setCheckedKeys(this.MenuIds)
      // 取消展开
      const nodesmap = this.$refs.Tree.store.nodesMap
      // 这里拿到的是一个对象
      for (const key in nodesmap) {
        const item = nodesmap[key]
        item.expanded = false
      }
    },
    // 点击删除角色
    delRoles(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await removeRole(id)
        const { success, message } = res
        if (success) {
          this.$message.success('删除成功')
          // 删除成功 刷新列表
          this.getRolesList()
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
      this.getRolesList()
    },
    // 当前页码变化
    currentChange(val) {
      this.pagination.start = val
      this.getRolesList()
    }
  }
}
</script>
<style scoped lang='scss'>
::v-deep .el-form-item__label{
  font-size: 13px;
}
::v-deep .el-col-12{
  display: flex;
}
</style>
