<template>
  <div class="main">
    <el-card shadow="never" class="margin">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <el-form ref="form" :model="ExitForm" :rules="rules" label-width="80px" size="mini">
        <el-row :gutter="20">
          <el-col :span="4" :offset="0">
            <el-form-item label="订单编号">
              <el-input v-model="ExitForm.orderSn" size="mini" placeholder="请输入订单编号" />
            </el-form-item>
          </el-col>

          <el-col :span="8" :offset="2">
            <!-- 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 -->
            <el-form-item label="退单状态">
              <el-select v-model="ExitForm.status" size="medium" placeholder="退单状态" clearable filterable>
                <el-option
                  label="待处理"
                  :value="0"
                />
                <el-option
                  label="退货中"
                  :value="1"
                />
                <el-option
                  label="已完成"
                  :value="2"
                />
                <el-option
                  label="已拒绝"
                  :value="3"
                />
              </el-select>

            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="20">
            <el-form-item>
              <el-button @click="resect">重置</el-button>
              <el-button type="primary" @click="goSeach">立即查询</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </el-card>

    <!-- 退单列表 -->
    <div class="exit">
      <el-table :data="Exitlist" border stripe>
        <el-table-column
          fixed="left"
          type="index"
          label="#"
          width="50"
          align="center"
        />
        <el-table-column
          label="订单编号"
          prop="orderSn"
          align="center"
        />
        <el-table-column
          label="退单状态"
          align="center"
        >
          <template slot-scope="scope">
            <!-- status (string, optional): 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 -->
            <el-tag v-if="scope.row.status === 0" type="danger" class="tag">待处理</el-tag>
            <el-tag v-if="scope.row.status === 1" type="warning" class="tag">退货中</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success" class="tag">已完成</el-tag>
            <el-tag v-if="scope.row.status === 3" type="info" class="tag">已拒绝</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="描述"
          prop="description"
          align="center"
        />

        <el-table-column
          label="商品名称"
          prop="productName"
          align="center"
        />
        <el-table-column
          label="商品属性"
          align="center"
        >
          <template slot-scope="scope">
            <!-- 这里使用过滤属性把他的属性过滤出来 -->
            {{ scope.row.productAttr | filterProArr }}
          </template>
        </el-table-column>
        <el-table-column
          label="商家备注"
          prop="handleNote"
          align="center"
        />
        <el-table-column
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="primary" size="medium" icon="el-icon-view" @click="LookProduct(scope.row.id)">查看订单</el-button>
          </template>

        </el-table-column>
      </el-table>
      <el-pagination
        :current-page.sync="pagination.start"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />
    </div>

  </div>
</template>
<script>
import mix from '@/mixins/index'
// 获取退单列表
import { findReturnApply } from '@/api/order/list/returnList'
export default {
// 当前页面的name
  name: 'ChargeBack',
  filters: {
    filterProArr(arr) {
      let Prostaus = ''
      try {
        const spData = JSON.parse(arr)
        spData.forEach(item => {
          // 此时parse解析后spData具有两个对象 遍历两次
          Prostaus += ' ' + item.key + ':' + ' ' + item.value
        })
      } catch (e) {
        console.log('spData.item 解析错误，打印错误信息 ==>', e)
        return arr // ['颜色：现代黑  大小：中', '颜色：现代黑 大小:大']
      }
      Prostaus = Prostaus.substring(1)
      return Prostaus
    }
  },

  mixins: [mix],
  data() {
    return {
      ExitForm: {}, // 退单条件查询
      rules: {}, // 表单校验
      Exitlist: []// 退单列表
    }
  },
  created() {
    this.getExitList()
  },
  methods: {
    /**
     * 获取退单列表
     */
    async getExitList() {
      const res = await findReturnApply(this.pagination.start, this.pagination.limit, this.ExitForm)
      console.log(res)
      const { success, data, message } = res
      if (success) {
        this.Exitlist = data.rows
        this.pagination.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    /**
     * 退单查询
     */
    goSeach() {
      this.getExitList()
    },
    /**
     * 查看退单详情
     */
    LookProduct(id) {
      this.$router.push({ name: 'BackDetail', params: { id }})
    },
    /**
     * 重置表单输入框
     */
    resect() {
      this.ExitForm = this.$options.data().ExitForm
      this.getExitList() // 重置之后更新数据列表
    },
    // 分页limit改变
    sizeChange(val) {
      this.pagination.start = 1
      this.pagination.limit = val
      this.getExitList()
    },
    // 当前页start 改变
    currentChange(val) {
      this.pagination.start = val
      this.getExitList()
    }
  }
}
</script>
<style scoped lang='scss'>
.margin{
  margin: 20px;
}

::v-deep .el-form-item__label {
  font-weight: normal;
}
.exit{
  padding: 20px;
  background-color: #fff;
  margin: 20px;
}
</style>
