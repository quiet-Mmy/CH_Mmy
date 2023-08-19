<template>
  <div class="orderDetail-main">
    <el-card shadow="never" class="marin">
      <!-- active代表是当前是第几步骤 根据状态变化  'status': 1, // 订单状态：0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单 -->
      <el-steps :active="orderBase.status + 1" class="pad">
        <el-step title="代付款" :description="orderBase.createTime" />
        <el-step title="待发货" :description="orderBase.paymentTime" />
        <el-step title="已发货" :description="orderBase.deliveryTime" />
        <el-step
          v-if="orderBase.status !== 4"
          title="已完成"
          :description="orderBase.receiveTime"
        />
        <el-step
          v-if="orderBase.status !== 3"
          title="退货"
          :description="orderBase.finishTime"
        />
      </el-steps>
      <!-- 分割线 -->
      <el-divider />
      <!-- 订单信息 -->
      <div>
        <h3>
          订单信息：
          <el-tag
            v-if="orderBase.status === 0"
            type="danger"
            class="tag"
          >代付款</el-tag>
          <el-tag
            v-if="orderBase.status === 1"
            type="success"
            class="tag"
          >待发货</el-tag>
          <el-tag
            v-if="orderBase.status === 2"
            type="success"
            class="tag"
          >已发货</el-tag>
          <el-tag v-if="orderBase.status === 3" class="tag">已完成</el-tag>
          <el-tag
            v-if="orderBase.status === 4"
            type="danger"
            class="tag"
          >退货</el-tag>
          <el-tag
            v-if="orderBase.status === 5"
            type="info"
            class="tag"
          >无效订单</el-tag>
        </h3>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <p>
              订单金额：<span style="color: red">{{
                orderBase.totalAmount
              }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              订单编号：<span>{{ orderBase.orderSn }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              用户账号：<span>{{ orderBase.memberUsername }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              备注：<span>{{ orderBase.note ? orderBase.note : '暂无' }}</span>
            </p>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <p>
              下单时间：<span>{{ orderBase.createTime }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              付款时间：<span>{{ orderBase.paymentTime }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              发货时间：<span>{{ orderBase.deliveryTime }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              收货时间：<span>{{ orderBase.receiveTime }}</span>
            </p>
          </el-col>
        </el-row>
      </div>
      <!-- 分割线 -->
      <el-divider />
      <!-- 收货人信息: -->
      <div>
        <h3>收货人信息:</h3>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <p>收货人：{{ orderBase.receiverName }}</p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>用户姓名：{{ orderBase.memberUsername }}</p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>手机号码：{{ orderBase.receiverPhone }}</p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>邮政编码：{{ orderBase.receiverPostCode }}</p>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <div>
              城市：<span>{{ orderBase.receiverProvince }}</span>
              <span>{{ orderBase.receiverCity }}</span>
            </div>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>详细地址：{{ orderBase.receiverDetailAddress }}</p>
          </el-col>
        </el-row>
      </div>
      <!-- 分割线 -->
      <el-divider />
      <!-- 商品信息 -->
      <div>
        <h3>商品信息:</h3>
        <el-table :data="orderItems" border stripe>
          <el-table-column prop="productName" label="商品名称" align="center" />
          <el-table-column label="商品图片" align="center">
            <template slot-scope="scope">
              <img
                width="100px"
                height="100px"
                :src="scope.row.productPic"
                alt=""
              >
            </template>
          </el-table-column>
          <el-table-column label="是否退货" align="center">
            <template slot-scope="scope">
              <span :style="{ color: scope.row.isReturn === 1 ? 'red' : '' }">{{
                scope.row.isReturn === 0 ? '否' : '是'
              }}</span>
            </template>
          </el-table-column>

          <el-table-column prop="productBrand" label="品牌" align="center" />
          <el-table-column prop="totalPrice" label="价格" align="center" />
          <el-table-column prop="productQuantity" label="数量" align="center" />
          <el-table-column prop="realAmount" label="小计" align="center" />
        </el-table>
      </div>
      <!-- 费用信息 -->
      <div>
        <h3>费用信息:</h3>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <p>运费金额：<span style="color: red">0</span></p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              订单总金额：
              <span style="color: red">{{ orderBase.totalAmount }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>
              实际金额：
              <span style="color: red">{{ orderBase.payAmount }}</span>
            </p>
          </el-col>
          <el-col :span="6" :offset="0">
            <p>促销优化金额：<span style="color: red">0</span></p>
          </el-col>
        </el-row>
        <!-- 发货物流信息 -->
        <div v-if="orderBase.status === 1" class="margin-30">
          <el-form
            ref="form"
            :model="sendFrom"
            :rules="rules"
            label-width="80px"
            size="mini"
          >
            <el-row :gutter="20">
              <el-col :span="6" :offset="0">
                <el-form-item label="物流公司" prop="deliveryCompany">
                  <el-select
                    v-model="sendFrom.deliveryCompany"
                    placeholder="请选择物流公司"
                    clearable
                    filterable
                  >
                    <el-option label="中国邮政" value="中国邮政" />
                    <el-option label="韵达" value="韵达" />
                    <el-option label="顺丰" value="顺丰" />
                    <el-option label="申通" value="申通" />
                  </el-select>
                </el-form-item>
              </el-col>
              <el-col :span="6" :offset="0">
                <el-form-item label="物流单号" prop="deliverySn">
                  <el-input v-model="sendFrom.deliverySn" />
                </el-form-item>
              </el-col>
            </el-row>

            <el-row :gutter="20">
              <el-col :span="6" :offset="12">
                <el-form-item>
                  <el-button
                    type="primary"
                    @click="doSendProduct"
                  >确认发货</el-button>
                </el-form-item>
              </el-col>
            </el-row>
          </el-form>
        </div>
      </div>

      <!-- 物流信息 代付款和待发货不让他显示物流信息-->
      <div v-if="!(orderBase.status === 0|| orderBase.status === 1)">
        <!-- 分割线 -->
        <el-divider />
        <h3>
          物流信息：<span
            class="info"
          >{{ orderBase.deliveryCompany||'飞机邮政' }}【{{ orderBase.deliverySn||182937262713681263 }}】</span>
        </h3>
        <el-table :data="list" border stripe>
          <el-table-column label="时间" width="200" prop="time" />
          <el-table-column label="状态" prop="value" />
          <el-table-column label="备猪" width="400" prop="bz" />
        </el-table>
      </div>
    </el-card>
  </div>
</template>
<script>
import { orderDetail, sendDone } from '@/api/order/list/index'
export default {
  // 当前页面的name
  name: 'OrderDetail',
  mixins: [],
  data() {
    return {
      orderId: '', // 保存进来的id
      orderBase: {}, // 订单基础信息
      orderItems: [], // 订单信息
      sendFrom: {}, // 设置发货信息
      rules: {
        deliveryCompany: [
          { required: true, message: '物流公司必须填', trigger: 'blur' }
        ],
        deliverySn: [
          { required: true, message: '物流单号必须填', trigger: 'blur' }
        ]
      }, // 发货表单校验
      list: [{ time: '2015-03-06 21:16:58', value: '深圳市横岗速递营销部已收件', bz: '揽投员姓名：钟定基;联系电话：13883838888' },
        { time: '2015-03-07 14:25:00', value: '离开深圳市 发往广州市', bz: '' },
        { time: '2032-08-14 14:10:00', value: '离开广州市 发往郑州市', bz: '' },
        { time: '2032-08-20 18:21:00', value: '已到郑州市 准备投递', bz: '预计今天到达' },
        { time: '2032-08-27 18:21:00', value: '呼和浩特市邮政速递物流分公司金川揽投部安排投递', bz: '投递员姓名：黄飞鸿;联系电话：18047140142' }
      ] // 设置当前的快递信息
    }
  },
  created() {
    this.orderId = this.$route.params.id
    this.getOrderDetail()
  },
  mounted() {},
  methods: {
    /**
     * 获取订单详情
     */
    async getOrderDetail() {
      const res = await orderDetail(this.orderId)
      console.log(res)
      const { success, data, message } = res
      if (success) {
        this.orderBase = data.orderDetail.orderBase
        this.orderItems = data.orderDetail.orderItems
      } else {
        this.$message.error(message)
      }
    },
    /**
     * 确认发货
     */
    async doSendProduct() {
      // 接口要求是一个对象 要求Id 单号 公司名称
      // 解构出来 上传的单号和名称
      const res = await sendDone({
        orderId: this.orderId,
        ...this.sendFrom
        // deliverySn: this.sendFrom.deliverySn,
        // deliveryCompany: this.sendFrom.deliveryCompany
      })
      console.log(res)
      const { success, message } = res
      if (success) {
        this.getOrderDetail()
      } else {
        this.$message.error(message)
      }
    }
  }
}
</script>
<style scoped lang='scss'>
.marin {
  margin: 20px;
}
::v-deep .pad {
  padding: 20px 180px;
}
.info {
  font-size: 16px;
  color: gray;
}
</style>
