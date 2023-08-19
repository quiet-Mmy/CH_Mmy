<template>
  <div>
    <el-card shadow="never" class="margin-30 padd">
      <div slot="header">
        <el-button type="primary" size="mini" @click="goAdd">新增</el-button>
      </div>
      <el-table :data="AddressList" border stripe>
        <el-table-column
          type="index"
          fixed="left"
          label="#"
          width="50"
          align="center"
        />
        <el-table-column
          label="地址名称"
          width="250"
          align="center"
          prop="addressName"
        />
        <el-table-column
          label="默认发货地址"
          width="200"
          align="center"
        >
          <template slot-scope="scope">
            <span>默认发货地址：</span>
            <!-- sendStatus (integer, optional): 默认发货地址：0->否；1->是 -->
            <el-switch v-model="scope.row.sendStatus" :active-value="1" :inactive-value="0" @change="changeStatusAddres(scope.row.id)" />
          </template>
        </el-table-column>

        <el-table-column
          label="收货人姓名"
          width="200"
          align="center"
          prop="name"
        />
        <el-table-column
          label="收货人电话"
          width="200"
          align="center"
          prop="phone"
        />

        <!-- prop="" -->
        <el-table-column
          label="收货人地址"
          width="300"
          align="center"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.province }} {{ scope.row.city }} {{ scope.row.region }}</div>
            <div>{{ scope.row.detailAddress }}</div>
          </template>
        </el-table-column>

        <el-table-column
          label="创建时间"
          width="200"
          align="center"
          prop="createTime"
        />
        <el-table-column
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" style="color: #409eff;" size="mini" @click="Edit(scope.row.id)">编辑</el-button>
            <el-button type="text" style="color:red;" size="mini" @click="delt(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 封装的对话框 -->
    <AddressDialog ref="DiaLog" @getAddrs="getAddress" />
  </div>
</template>
<script>

//          获取地址列表 设置默认发货地 新增地址 获取地址详情 更新地址  删除当前地址
// import { addressList, setSendOne, save, getAddress, update, DELAddress } from '@/api/order/address/index'
import { addressList, setSendOne, DELAddress, getIdAddress } from '@/api/order/address/index'

// 导入组件
import AddressDialog from './addressDialog.vue'
export default {
  // 当前页面的name
  name: 'AddressList',
  components: { AddressDialog },
  mixins: [],

  data() {
    return {
      AddressList: []
    }
  },

  created() {
    this.getAddress()
  },
  mounted() {},
  methods: {
    // 点击去新增  调用组件实例上的方法
    goAdd() {
      this.$refs.DiaLog.openDialog()
    },

    // 获取地址列表
    async getAddress() {
      const res = await addressList()
      console.log(res)
      const { success, data, message } = res
      if (success) {
        this.AddressList = data.items
      } else {
        this.$message.error(message)
      }
    },
    // 修改当前的默认发货地址
    // 修改完成之后 刷新列表 后台处理了排他
    async changeStatusAddres(id) {
      const res = await setSendOne({ id })
      const { success, message } = res
      console.log(res)
      if (success) {
        // 修改完成刷新列表
        this.getAddress()
        this.$message.success('修改成功')
      } else {
        this.$message.error(message)
      }
    },

    // 点击编辑表单 需要回显
    async Edit(id) {
      this.$refs.DiaLog.openDialog()
      this.$refs.DiaLog.setId(id)
      const res = await getIdAddress(id)
      const { success, data, message } = res
      console.log(res)
      if (success) {
        this.$refs.DiaLog.setData(data.address, data.address.cityCode.split(','))
        // this.address = data.address
        // 这里需要分割数组 赋值给三地联动
        // this.selectedOptions = data.address.cityCode.split(',')
      } else {
        this.$message.error(message)
      }
    },
    // 点击删除当前地址
    async delt(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await DELAddress(id)
        const { success, message } = res
        console.log(res)
        if (success) {
        // 删除完成刷新列表
          this.getAddress()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.error(message)
        }
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }

  }
}
</script>
//可以设置代码为scss  lang='scss'
<style scoped>
.padd{
  margin: 20px;
}
</style>
