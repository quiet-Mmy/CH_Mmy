<template>
  <div>
    <!-- 弹出窗 before-close   handleClose=关闭之前执行的回调
        handlerCancleEvnet 点击关闭取消后会自动触发
      -->
    <el-dialog
      :title="addressId?'编辑地址':'新增地址'"
      :visible.sync="dialogVisible"
      width="60%"
      :before-close="handleClose"
      @close="handlerCancleEvnet"
    >
      <el-form ref="formAddress" :model="address" :rules="rules" label-width="120px" size="mini">
        <el-row :gutter="20">
          <el-col :span="10" :offset="0">
            <el-form-item label="地址名称" prop="addressName">
              <el-input v-model="address.addressName" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="0">
            <el-form-item label="收货人姓名" prop="name">
              <el-input v-model="address.name" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="0">
            <el-form-item label="收货人手机号" prop="phone">
              <el-input v-model="address.phone" />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="0">
            <el-form-item label="邮政编码" prop="postCode">
              <el-input v-model="address.postCode" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <!-- 三级联动的地址 -->
          <el-col :span="10" :offset="0">
            <el-form-item label="收货地址">
              <el-cascader
                v-model="selectedOptions"
                style="width: 100%;"
                :options="regionData"
              />
            </el-form-item>
          </el-col>
          <el-col :span="10" :offset="0">
            <el-form-item label="详细地址">
              <el-input v-model="address.detailAddress" />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="10" :offset="14">
            <el-form-item>
              <el-button @click="handleClose">取消</el-button>
              <el-button type="primary" @click="addOrEdit">{{ addressId?'编辑':'确认' }}</el-button>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

    </el-dialog>
  </div>
</template>
<script>
// 导入三级联动   codeToText['000111'] 地址编码 转化为地址
import { regionData, codeToText } from 'element-china-area-data'
import { save, update } from '@/api/order/address/index'

export default {
// 当前页面的name
  name: '',
  mixins: [],
  data() {
    return {
      // 弹出窗的默认值
      dialogVisible: false,

      // 设置新增表单的form
      address: {},
      // 编辑地址需要的id
      addressId: '',

      // 校验规则
      rules: {
        addressName: [{ required: true, message: '地址名称还没有填', trigger: 'blur' }],
        name: [{ required: true, message: '收货人姓名还没有填', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号必须填', trigger: 'blur' }],
        postCode: [{ required: true, message: '邮政编码需要填', trigger: 'blur' }]
      },

      // 三级联动数据源
      regionData,
      // 三级联动绑定的值
      selectedOptions: ['41', '4105', '410526']
    }
  },
  mounted() {

  },
  methods: {
    setId(addressId) {
      this.addressId = addressId
    },
    setData(address, selectedOptions) {
      this.address = address
      this.selectedOptions = selectedOptions
    },
    openDialog() {
      this.dialogVisible = true
    },
    // addOrEdit 点击 确认 新增地址
    addOrEdit() {
      // 先用正则判断是否满足条件
      this.$refs.formAddress.validate(async(valid) => {
        if (valid) {
          // 校验正常就正常发请求添加
          console.log(this.address)
          // 添加省市区
          this.address.province = codeToText[this.selectedOptions[0]]
          this.address.city = codeToText[this.selectedOptions[1]]
          this.address.region = codeToText[this.selectedOptions[2]]
          // 数组转字符串 ，号隔开
          this.address.cityCode = this.selectedOptions.join(',')

          const api = this.addressId ? update : save
          const res = await api(this.address)
          const { success, message } = res
          console.log(res)
          if (success) {
            // 关闭对话框
            this.dialogVisible = false

            // 修改完成刷新列表
            // this.getAddress()
            this.$emit('getAddrs')

            // 重置表单
            this.resetFrom()
            this.$message.success('上传成功')
          } else {
            this.$message.error(message)
          }
        } else {
          this.$message.error('您的表单没有填写完成')
        }
      })
    },

    // // 点击关闭弹出窗
    handleClose(done) {
      this.dialogVisible = false
    },
    // 点击关闭弹出窗
    handlerCancleEvnet() {
      this.resetFrom()
    },

    // 重置表单
    resetFrom() {
      this.address = this.$options.data().address
      this.selectedOptions = this.$options.data().selectedOptions
      this.addressId = this.$options.data().addressId
    }
  }
}
</script>
//可以设置代码为scss  lang='scss'
<style scoped>
</style>
