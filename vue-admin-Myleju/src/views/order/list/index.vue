<template>
  <div>
    <el-card shadow="never">
      <div slot="header">
        <span>条件查询</span>
      </div>
      <!-- 头部条件查询 -->
      <el-form
        ref="form"
        :model="orderSeachList"
        label-width="100px"
        size="normal"
      >
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <el-form-item label="订单编号">
              <el-input
                v-model="orderSeachList.orderSn"
                style="width: 200px"
                size="mini"
                placeholder="请填写订单编号"
              />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="订单类型">
              <el-select
                v-model="orderSeachList.orderType"
                size="mini"
                placeholder="订单类型"
                clearable
              >
                <el-option label="正常类型" :value="0" />
                <el-option label="秒杀订单" :value="1" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="支付方式">
              <el-select
                v-model="orderSeachList.payType"
                size="mini"
                placeholder="支付方式"
                clearable
              >
                <el-option label="未支付" :value="0" />
                <el-option label="支付宝" :value="1" />
                <el-option label="微信" :value="2" />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="订单状态">
              <el-select
                v-model="orderSeachList.status"
                size="mini"
                placeholder="订单状态"
                clearable
              >
                <el-option
                  v-for="item in sts"
                  :key="item.value"
                  :label="item.text"
                  :value="item.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="20">
            <el-form-item>
              <el-button
                type="primary"
                size="mini"
                @click="getOrderList"
              >搜索</el-button>
              <el-button size="mini" @click="resect">重置</el-button>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <!--列表-->
    <el-card v-loading="loading" shadow="never">
      <el-table :data="orderList" border stripe>
        <el-table-column
          fixed="left"
          type="index"
          label="#"
          width="50px"
          align="center"
        />
        <el-table-column label="订单编号" prop="orderSn" align="center" />
        <el-table-column label="支付方式" align="center">
          <template slot-scope="scope">
            <!-- payType (integer, optional): 支付方式：0->未支付；1->支付宝；2->微信 , -->
            <el-tag
              v-if="scope.row.payType === 0"
              class="tag"
              effect="dark"
              type="info"
            >未支付</el-tag>
            <el-tag v-if="scope.row.payType === 1" class="tag">
              <!-- icon-class 为 icon 的文件名字;   class-name 为 icon 自定义 class-->
              <svg-icon icon-class="zhifubao" class-name="Myzhifubao" />
            </el-tag>
            <el-tag
              v-if="scope.row.payType === 2"
              effect="dark"
              class="tag"
              type="success"
            >
              <svg-icon icon-class="weixin" class-name="Myweixin" />
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          label="订单状态"
          align="center"
        >
          <template slot-scope="scope">
            <!-- status (integer, optional): 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->退货；5->无效订单 -->
            <el-tag v-if="scope.row.status === 0" type="danger" class="tag">代付款</el-tag>
            <el-tag v-if="scope.row.status === 1" type="success" class="tag">待发货</el-tag>
            <el-tag v-if="scope.row.status === 2" type="success" class="tag">已发货</el-tag>
            <el-tag v-if="scope.row.status === 3" class="tag">已完成</el-tag>
            <el-tag v-if="scope.row.status === 4" type="danger" class="tag">退货</el-tag>
            <el-tag v-if="scope.row.status === 5" type="info" class="tag">无效订单</el-tag>
          </template>
        </el-table-column>

        <el-table-column label="添加时间" prop="createTime" align="center" />
        <el-table-column label="用户账号" prop="memberUsername" align="center" />、

        <el-table-column
          label="订单类型"
          align="center"
        >
          <template>
            <!-- orderType  (integer, optional): 订单类型：0->正常订单；1->秒杀订单 , -->
            <!-- 这一个字段渲染不出来 用了其他字段 -->
            <!-- <el-tag v-if="scope.row.sourceType === 1" type="success">正常订单</el-tag>
            <el-tag v-if="scope.row.sourceType === 0" type="info">秒杀订单</el-tag> -->
            <el-tag effect="plain" type="success" size="mini">正常订单</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button icon="el-icon-view" type="primary" size="mini" @click="goOrderDetail(scope.row.id)">查看订单</el-button>

          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <el-pagination
        :current-page.sync="pagination.start"
        :page-sizes="pagination.pageSizes"
        :page-size="pagination.limit"
        layout="total, sizes, prev, pager, next, jumper"
        :total="pagination.total"
        @size-change="sizeChange"
        @current-change="currentChange"
      />

    </el-card>
  </div>
</template>
<script>
import mix from '@/mixins/index'
import { findOrdersByPage } from '@/api/order/list/index'
export default {
  // 当前页面的name
  name: 'OrderList',
  mixins: [mix],
  data() {
    return {
      sts: [
        {
          text: '代付款',
          value: 0
        },
        {
          text: '待发货',
          value: 1
        },
        {
          text: '已发货',
          value: 2
        },
        {
          text: '已完成',
          value: 3
        },
        {
          text: '退货',
          value: 4
        },
        {
          text: '无效订单',
          value: 5
        }
      ], // 搜索查询的订单状态
      orderSeachList: {}, // 头部查询列表 form 接收{}
      orderList: [], // 订单列表数据源
      loading: false// 加载loading
    }
  },
  created() {
    this.getOrderList() // 获取订单
  },
  mounted() {},
  methods: {
    /**
     * 获取订单列表
     */
    async getOrderList() {
      this.loading = true
      const res = await findOrdersByPage(
        this.pagination.start,
        this.pagination.limit,
        this.orderSeachList
      )
      const { success, data, message } = res
      console.log(res)
      if (success) {
        this.orderList = data.rows // 赋值订单数据列表
        this.pagination.total = data.total // 赋值mixins分页
      } else {
        this.$message.error(message)
      }
      this.loading = false
    },
    /**
     * 重置表单输入框
     */
    resect() {
      this.orderSeachList = this.$options.data().orderSeachList
      this.getOrderList() // 重置之后更新数据列表
    },
    // 分页limit改变
    sizeChange(val) {
      this.pagination.start = 1
      this.pagination.limit = val
      this.getOrderList()
    },
    // 当前页start 改变
    currentChange(val) {
      this.pagination.start = val
      this.getOrderList()
    },
    // 点击查看订单
    goOrderDetail(id) {
      this.$router.push({ name: 'OrderDetail', params: { id }})
    }
  }
}
</script>
//可以设置代码为scss  lang='scss'
<style scoped lang='scss'>
::v-deep .el-card {
  margin: 20px;
}
::v-deep .el-form-item__label {
  font-weight: normal;
}

.Myzhifubao,
.Myweixin {
  width: 20px;
  height: 20px;
}
.tag {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 30px;
  line-height: 30px;
  margin: 0 auto;
}
</style>
