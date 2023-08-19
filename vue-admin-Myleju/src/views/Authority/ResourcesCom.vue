<template>
  <div>
    <el-card shadow="never" class="margin">
      <div slot="header">
        <el-button type="warning" size="mini">初始化菜单</el-button>
        <el-button type="primary" size="mini" @click="addMenu">新增菜单</el-button>
      </div>
      <el-table
        :data="MenuList"
        border
        stripe
        row-key="id"
        size="mini"
      >
        <el-table-column
          label="
        菜单名称"
          prop="title"
          width="200px"
          align="left"
        />
        <el-table-column
          label="图标"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            <i :class="scope.row.icon" />
          </template>
        </el-table-column>
        <el-table-column
          label="等级"
          prop="level"
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
          label="权限标识"
          width="250px"
          align="center"
          prop="permissionValue"
        />

        <el-table-column
          label="路由"
          align="center"
          width="150px"
          prop="path"
        />

        <el-table-column
          label="组件路径"
          align="center"
          prop="component"
        />

        <el-table-column
          label="是否可用"
          align="center"
          width="180px"
          prop="status"
        />

        <el-table-column
          label="创建时间"
          align="center"
          width="180px"
          prop="createTime"
        />
      </el-table>
    </el-card>

    <!-- 对话窗 -->
    <el-dialog
      title="新增菜单"
      :visible.sync="dialogVisible"
      width="50%"
      @close="handleEvent"
    >

      <el-form ref="MenuDialog" :model="MenuDialogFrom" label-width="80px" :inline="false" size="normal">
        <el-form-item label="菜单类型">
          <el-radio v-model="current" :label="0">顶级目录</el-radio>
          <el-radio v-model="current" :label="1">菜单</el-radio>
          <el-radio v-model="current" :label="2">按钮</el-radio>
        </el-form-item>

        <el-form-item v-if="current!==0" label="上级菜单">
          1
        </el-form-item>

        <el-form-item v-if="current===2" label="按钮名称">
          <el-input v-model="MenuDialogFrom.BtnName" placeholder="按钮名称：比如新增" />
        </el-form-item>

        <el-form-item v-if="current!==2" label="路由名称">
          <el-input v-model="MenuDialogFrom.name" placeholder="前端路由name,唯一" />
        </el-form-item>
        <el-form-item v-if="current!==2" label="路径">
          <el-input v-model="MenuDialogFrom.path" placeholder="前端路由path,忽略父节点路径" />
        </el-form-item>
        <el-form-item v-if="current!==2" label="组件路径">
          <el-input v-model="MenuDialogFrom.component" placeholder="前端路由组件路径 比如@/views/foo/foo.vue" />
        </el-form-item>
        <el-form-item v-if="current!==2" label="重定向">
          <el-input v-model="MenuDialogFrom.redirect" placeholder="redirect属性" />
        </el-form-item>

        <el-row :gutter="20">
          <el-col :span="11" :offset="0">
            <el-form-item label="排序">
              <el-input-number
                v-model="MenuDialogFrom.sort"
                size="mini"
                :min="0"
                :step="1"
                :controls="true"
                controls-position="both"
              />
            </el-form-item>
          </el-col>

          <el-col v-if="current===1" :span="11" :offset="0">
            <el-form-item label="层级">
              <el-input-number
                v-model="MenuDialogFrom.sort"
                size="mini"
                :min="0"
                :step="1"
                :controls="true"
                controls-position="both"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row v-if="current!==2" :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="是否隐藏">
              <el-radio v-model="MenuDialogFrom.ishide" checked label="0">否</el-radio>
              <el-radio v-model="MenuDialogFrom.ishide" label="1">是</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="12" :offset="0">
            <el-form-item label="是否展开">
              <el-radio v-model="MenuDialogFrom.isExpand" label="0" checked>否</el-radio>
              <el-radio v-model="MenuDialogFrom.isExpand" label="1">是</el-radio>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item v-if="current!==2" label="meta属性">
          <!-- meata属性  ??? -->
          <el-row v-for="(item) in metaList" :key="item.tempId" :gutter="20">
            <el-col :span="8" :offset="0">
              <el-input v-model="item.title" placeholder="meta属性名" clearable size="mini" />
            </el-col>
            <el-col :span="8" :offset="0">
              <el-input v-model="item.value" placeholder="meta属性值" clearable size="mini" />
            </el-col>
            <el-col :span="6" :offset="0">
              <div>
                <span style="margin-right: 10px;" @click="AddMeta">
                  <i class="el-icon-plus" />
                </span>
                <span v-if="!item.title" @click="del(item.tempId)">
                  <i class="el-icon-minus" />
                </span>
              </div>
            </el-col>
          </el-row>

        </el-form-item>

        <el-form-item v-if="current===2" label="权限标识">
          <el-input
            v-model="MenuDialogFrom.authority"
            type="textarea"
            :rows="2"
            placeholder="权限标识"
          />
        </el-form-item>

        <el-form-item>
          <el-row :gutter="20">
            <el-col :span="12" :offset="20">
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
import { v4 as uuidv4 } from 'uuid'
import { getInitMenus } from '@/api/Authority/ResourcesIndex'
export default {
// 当前页面的name
  name: 'Resources',
  mixins: [],
  data() {
    return {
      current: 0, // 当前页面
      MenuList: [], // 全部菜单
      dialogVisible: false, // 对话窗
      MenuDialogFrom: {
        sort: 0
      }, // 菜单新增框
      metaList: [
        {
          title: 'title',
          value: 'views/sxxx/ssedsaw',
          tempId: uuidv4()
        },
        {
          title: 'icons',
          value: 'el-icon-minus',
          tempId: uuidv4()
        }
      ]
    }
  },
  watch: {
    current: {
      immediate: true, // 初始化监听
      handler() {
        // current 发生变化 函数的this指向实例对象  监听到
        this.MenuDialogFrom = this.$options.data().MenuDialogFrom
      }
    }
  },
  created() {
    this.getPermissions()
  },

  methods: {
    // 获取初始化的所有菜单
    async getPermissions() {
      this.MenuList = [] // 清空数组
      const res = await getInitMenus()
      const { success, data, message } = res
      if (success) {
        // 设置全部分类的格式 需要放在同一个对象里面  全部菜单
        data.permissionList.forEach(item => {
          this.MenuList.push({
            ...item,
            children: item.children
          })
        })
        console.log('列表', this.MenuList)
      } else {
        this.$message.error(message)
      }
    },
    // 添加新的meta
    AddMeta() {
      this.metaList.push({
        title: '',
        value: '',
        tempId: uuidv4()
      })
    },
    // 删除当前的meta
    del(uid) {
      this.metaList = this.metaList.filter(item => item.tempId !== uid)
    },
    // 新增菜单
    addMenu() {
      this.dialogVisible = true
    },
    // 对话框点击确定
    addOrEditUser() {

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
      this.MenuDialogFrom = this.$options.data().MenuDialogFrom
    }
  }
}
</script>
<style scoped lang='scss'>
::v-deep .el-form-item__content{
  margin-left: 90px !important;
}
.el-form-item__content .el-row{
  margin-bottom: 20px;
}
</style>
