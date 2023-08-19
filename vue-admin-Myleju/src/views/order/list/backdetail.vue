<template>
  <div class="returnDetail">
    <el-card shadow="never" class="margin">
      <div class="title">
        <h4>订单信息:
          <!-- status (string, optional): 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 -->
          <el-tag v-if="returnList.status === 0" type="danger" class="tag">待处理</el-tag>
          <el-tag v-if="returnList.status === 1" type="warning" class="tag">退货中</el-tag>
          <el-tag v-if="returnList.status === 2" type="success" class="tag">已完成</el-tag>
          <el-tag v-if="returnList.status === 3" type="info" class="tag">已拒绝</el-tag>
        </h4>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <div>订单编号: {{ returnList.orderSn }}
              <!-- 点击跳转到订单详情   需要传订单的id -->
              <router-link :to="'/order/OrderDetail/'+returnList.orderId" class="dd">查看订单详情</router-link>
            </div>
          </el-col>
          <el-col :span="6" :offset="0">
            退单人姓名: {{ returnList.returnName }}
          </el-col>
          <el-col :span="6" :offset="0">
            退单人理由: {{ returnList.reason }}
          </el-col>
          <el-col :span="6" :offset="0">
            退单人描述: {{ returnList.description }}
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">申请时间: {{ returnList.createTime }}</el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <div v-if="returnList.proofPics" class="pad">
              退单图片:
              <el-image
                style="width: 100px; height: 100px;margin-left: 30px;"
                :src="returnList.proofPics"
                :preview-src-list="[returnList.proofPics]"
              />
            </div>
          </el-col>
        </el-row>
      </div>
      <!-- 分割线 -->
      <el-divider />

      <!-- 退货商品 -->
      <div v-if="returnList.id" class="title">
        <h4>退货商品:</h4>
        <el-table :data="[returnList]" border stripe>
          <el-table-column
            label="商品图片"
            align="center"
          >
            <template slot-scope="scope">
              <img width="100" height="100" :src="scope.row.productPic" alt="">
            </template>
          </el-table-column>

          <el-table-column
            label="商品描述"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.productName }}</span>
              <br>
              <span>品牌：{{ scope.row.productBrand }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品价格"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.productPrice }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品属性"
            align="center"
          >
            <template slot-scope="scope">
              <span>{{ scope.row.productAttr|filterProArr }}</span>
            </template>
          </el-table-column>

          <el-table-column
            label="商品数量"
            align="center"
            prop="productCount"
          />

          <el-table-column
            label="总计"
            align="center"
          >
            <template>
              {{ AllPrice }}
            </template>
          </el-table-column>
        </el-table>
        <!-- 用户信息 -->
        <h4>用户信息:</h4>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">联系人:{{ returnList.returnName }}</el-col>
          <el-col :span="6" :offset="0">联系电话:{{ returnList.returnPhone }}</el-col>
        </el-row>
      </div>
      <el-divider />

      <!-- 费用信息 -->
      <!-- status (string, optional): 申请状态：0->待处理；1->退货中；2->已完成；3->已拒绝 -->
      <div>
        <h4>费用信息:</h4>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">退单金额：
            <span style="color: red;"> {{ returnList.returnAmount }}</span>
          </el-col>
          <el-col :span="6" :offset="0">运费金额：<span style="color: red;">0</span></el-col>
        </el-row>
        <!-- 设置退单金额 -->
        <el-form v-if="returnList.status===0" ref="form" :model="form" :rules="rules" label-width="100px" :inline="false" size="mini">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="退单金额：">
                <el-input-number
                  v-model="form.returnAmount"
                  style="width: 100%;"
                  label="0"
                  :min="0"
                  :controls="true"
                  controls-position="both"
                />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="处理人：" prop="handleMan">
                <el-input v-model="form.handleMan" size="mini" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="处理备注：" prop="handleNote">
                <el-input v-model="form.handleNote" size="mini" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10" :offset="8">
              <el-form-item>
                <div style="margin:0 auto">
                  <el-button style="width: 150px;height: 50px;" type="primary" @click="Exit('yes')">同意退款</el-button>
                  <el-button style="width:150px;height: 50px;" @click="Exit('no')">拒绝退款</el-button>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 处理结果: -->
      <div>
        <div v-if="returnList.status!==0">
          <el-divider />
          <h4>处理结果:</h4>
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">处理人：{{ returnList.handleMan }}</el-col>
            <el-col :span="6" :offset="0">处理备注：{{ returnList.handleNote }}</el-col>
            <el-col :span="6" :offset="0">处理时间：{{ returnList.handleTime }}</el-col>
          </el-row>
          <!-- 收货人 -->
        </div>
        <el-form v-if="returnList.status===1" ref="recevieFormComp" :model="receiveForm" :rules="receiveRules" label-width="100px" :inline="false" size="mini">
          <el-row :gutter="20">
            <el-col :span="6" :offset="0">
              <el-form-item label="收货人：" prop="receiveMan">
                <el-input v-model="receiveForm.receiveMan" size="mini" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="0">
              <el-form-item label="收货备注：" prop="receiveNote">
                <el-input v-model="receiveForm.receiveNote" size="mini" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="10" :offset="10">
              <el-form-item>
                <el-button style="width: 150px;margin-top:'30px';" type="success" size="medium" @click="OkProduct">确认收货</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
      <!-- 收货信息 -->
      <div v-if="returnList.status===2">
        <h4>收货信息:</h4>
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">退单收货人：{{ returnList.receiveMan }}</el-col>
          <el-col :span="6" :offset="0">退单收货备注：{{ returnList.receiveNote }}</el-col>
          <el-col :span="6" :offset="0">退单收货时间：{{ returnList.receiveTime }}</el-col>
        </el-row>
      </div>
    </el-card>
  </div>
</template>
<script>
import { orderReturn, agreeApply, rejectApply, receiveProduct } from '@/api/order/list/returnList'
export default {
  // 当前页面的name
  name: 'BackDetail',
  // 过滤
  filters: {
    // arr传进来的是每一个的数据
    filterProArr(arr) {
      let Prostaus = ''
      try {
        const spData = JSON.parse(arr)
        spData.forEach(item => {
          // 此时parse解析后spData具有两个对象 遍历两次
          Prostaus += ' ' + item.key + ':' + ' ' + item.value
        })
      } catch (e) {
        console.log('解析错误，错误信息 ==>', e)
        return arr // ['颜色：现代黑  大小：中', '颜色：现代黑 大小:大']
      }
      Prostaus = Prostaus.substring(1) // 取出第一位后面的数据
      return Prostaus
    }
  },
  mixins: [],
  data() {
    return {
      returnId: '', // 获取退单详情   这里的id是传进来的id 退单的id
      returnList: {}, // 退单详情
      form: {
        returnAmount: 0
      }, // 设置退单金额
      receiveForm: {}, // 收货人信息
      rules: {
        handleMan: [{ required: true, message: '处理人暂未填写', tigger: 'blur' }],
        handleNote: [{ required: true, message: '处理备注：暂未填写', tigger: 'blur' }]
      }, // 校验

      receiveRules: {
        receiveMan: [{ required: true, message: '收货人暂未填写', tigger: 'blur' }],
        receiveNote: [{ required: true, message: '收货备注：暂未填写', tigger: 'blur' }]
      }// 收货人校验
    }
  },
  computed: {
    // 计算总价
    AllPrice() {
      return this.returnList.productPrice * this.returnList.productCount
    }
  },
  created() {
    this.returnId = this.$route.params.id
    this.getExitDetail()
  },
  mounted() {},
  methods: {
    /**
     * 获取当前退单详细信息
     */
    async getExitDetail() {
      const res = await orderReturn(this.returnId)
      const { success, data, message } = res
      if (success) {
        this.returnList = data.orderReturnApply
      } else {
        this.$message.error(message)
      }
    },
    // 退货
    Exit(status) {
      // 校验表单
      this.$refs.form.validate(async(valid) => {
        if (valid) {
          // 判断调用哪个接口
          const api = status === 'yes' ? agreeApply : rejectApply
          // 接口要求 退单id
          this.form.id = this.returnId
          const res = await api(this.returnId, this.form)
          console.log(res)
          const { success, message } = res
          if (success) {
            this.$message.success('退货成功')
            this.getExitDetail()// 刷新列表
          } else {
            this.$message.error(message)
          }
        } else {
          this.$message.error('请注意表单校验')
        }
      })
    },

    // 确认收货
    OkProduct() {
      // 校验表单
      // this.$refs.recevieFormComp.validate(async(vaild) => {
      this.$refs.recevieFormComp.validate(async(valid) => {
        if (valid) {
          this.receiveForm.id = this.returnId
          // 接收id  和 表单
          const res = await receiveProduct(this.returnId, this.receiveForm)
          const { success, message } = res
          if (success) {
            this.$message.success('收货成功')
            this.getExitDetail()// 刷新列表
          } else {
            this.$message.error(message)
          }
        } else {
          this.$message.error('请注意表单校验')
        }
      })
    }
  }
}
</script>
<style scoped lang='scss'>
.dd{
  margin-left: 10px;
  color: darkorange;
  cursor: pointer;
  font-size: 14px;
}

::v-deep .el-row{
  padding: 10px 0;
  font-size: 14px;
}
::v-deep .pad{
  display: flex;
  align-items: flex-start;
  justify-content:flex-start;
}
::v-deep .el-form-item__label{
  font-weight: normal;
}
</style>
