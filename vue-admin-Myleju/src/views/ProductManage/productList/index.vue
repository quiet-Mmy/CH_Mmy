<template>
  <div class="productList">
    <el-collapse>
      <el-collapse-item title="商品管理介绍">
        <div>
          商品管理模块可以对客户端的商品进行增删改查等相关操作,来控制客户端商品的列表展示和商品详情
        </div>
      </el-collapse-item>
    </el-collapse>
    <!-- 条件查询 -->
    <el-collapse class="margin">
      <el-collapse-item title="条件查询">
        <el-form
          ref="form"
          :model="searchProductFrom"
          :rules="rules"
          label-width="100px"
          size="normal"
        >
          <el-row :gutter="20">
            <el-col :span="5" :offset="0">
              <el-form-item label="商品名称">
                <el-input v-model="searchProductFrom.name" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="0">
              <el-form-item label="商品货号">
                <el-input v-model="searchProductFrom.productSn" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="0">
              <el-form-item label="品牌">
                <el-select
                  v-model="searchProductFrom.brandId"
                  size="mini"
                  placeholder="品牌"
                  clearable
                >
                  <el-option
                    v-for="item in BrandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="5" :offset="0">
              <el-form-item label="上架状态">
                <!-- publishStatus (integer, optional): 上架状态，0->下架；1->上架 , -->
                <el-select
                  v-model="ListingStatus"
                  size="mini"
                  placeholder="上架状态"
                  clearable
                >
                  <el-option label="下架" :value="0" />
                  <el-option label="上架" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <!-- verifyStatus (integer, optional): 审核状态：0->未审核；1->审核通过 -->
            <el-col :span="5" :offset="0">
              <el-form-item label="审核状态">
                <el-select
                  v-model="searchProductFrom.verifyStatus"
                  size="mini"
                  placeholder="审核状态"
                >
                  <el-option label="未审核" :value="0" />
                  <el-option label="审核通过" :value="1" />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6" :offset="12">
              <el-form-item>
                <el-button @click="resectFrom">重置</el-button>
                <el-button type="primary" @click="SeachFrom">搜索</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </el-collapse-item>
    </el-collapse>
    <!-- 产品列表 -->
    <el-card shadow="never" class="margin-30 margin">
      <div slot="header">
        <el-button type="primary" size="mini" @click="addProduct">新增</el-button>
        <el-button type="primary" size="mini" @click="exportProduct">导出商品列表Excel文件</el-button>
      </div>
      <el-table :data="produceList" border stripe>
        <el-table-column
          fixed="left"
          type="index"
          align="center"
          label="序号"
          width="50"
        />
        <el-table-column
          align="center"
          label="商品图片"
          width="140"
        >
          <template slot-scope="scope">
            <el-image style="width: 90px; height: 90px;" :src="scope.row.pic" />
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="商品名称"
          width="420"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.name }}</div>
            <div>{{ scope.row.brandName }}</div>
            <div>{{ scope.row.description }}</div>
          </template>

        </el-table-column>
        <el-table-column
          align="center"
          label="商品价格"
          width="140"
        >
          <template slot-scope="scope">
            <div>原价：{{ scope.row.originalPrice }}</div>
            <div>现价：{{ scope.row.price }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="商品类别"
          width="140"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.productCategoryName }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="标签"
          width="140"
        >
          <template slot-scope="scope">
            <div>
              <span>最新: </span>
              <!-- newStatus (integer, optional): 新品状态:0->不是新品；1->新品 , -->
              <el-switch v-model="scope.row.newStatus" :active-value="1" :inactive-value="0" />
            </div>
            <div style="margin-top: 20px;">
              <span>推荐: </span>
              <!-- recommendStatus (integer, optional): 推荐状态；0->不推荐；1->推荐  -->
              <el-switch v-model="scope.row.recommendStatus" :active-value="1" :inactive-value="0" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="标签2"
          width="140"
        >
          <template slot-scope="scope">
            <div>
              <span>发布: </span>
              <!-- publishStatus (integer, optional): 上架状态，0->下架；1->上架 , -->
              <el-switch v-model="scope.row.publishStatus" :active-value="1" :inactive-value="0" />
            </div>
            <div style="margin-top: 20px;">
              <span>审核: </span>
              <!-- verifyStatus (integer, optional): 审核状态：0->未审核；1->审核通过 , -->
              <el-switch v-model="scope.row.verifyStatus" :active-value="1" :inactive-value="0" />
            </div>
          </template>
        </el-table-column>

        <el-table-column
          align="center"
          label="sku"
          width="140"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="EditSkuLog(scope.row.id)">编辑sku</el-button>
          </template>

        </el-table-column>

        <el-table-column
          align="center"
          label="重量"
          width="50"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.weight }}</div>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          label="排序"
          width="100"
        >
          <template slot-scope="scope">
            <div>{{ scope.row.sort }}</div>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          align="center"
          label="操作"
          width="100"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" @click="EditcurrProduct(scope.row.id)">编辑</el-button>
            <el-button style="color: red;" type="text" size="mini" @click="delProduct(scope.row.id)">删除</el-button>
          </template>

        </el-table-column>
      </el-table>
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
    </el-card>

    <!-- sku编辑框 -->
    <el-dialog title="sku列表" :visible.sync="dialogFormVisible">

      <el-row :gutter="20">
        <el-col :span="6" :offset="22">
          <el-button type="primary" @click="addSkuList">新增</el-button>
        </el-col>
      </el-row>
      <!-- 新增sku列表 table -->
      <el-table v-if="skuForm.length" :data="skuForm" border stripe class="margin-30">
        <el-table-column
          fixed="left"
          type="index"
          label="#"
          align="center"
        />
        <el-table-column
          label="图片"
          align="center"
        >
          <template slot-scope="scope">
            <!-- show-file-list 是否显示已上传文件列表 -->
            <el-upload
              class="avatar-uploader"
              :action="uploadFile"
              :headers="token"
              :show-file-list="false"
              :on-success="handleSkuPicSuccess"
              :before-upload="beforeSkuPicUpload"
              @click.native="hanleSkuPicEvent(scope.row.tempId)"
            >
              <img v-if="scope.row.pic" width="50" height="50" :src="scope.row.pic">
              <i v-else class="el-icon-plus avatar-uploader-icon-skuPic" />
            </el-upload>
          </template>
        </el-table-column>

        <el-table-column
          label="颜色"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.color" placeholder="颜色" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="大小"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.size" placeholder="大小" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="库存"
          align="center"
          width="140"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.stock" placeholder="自定义库存" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="预警库存"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.lowStock" placeholder="预警库存" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="锁定库存"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.lockStock" placeholder="锁定库存" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="sku编码"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.skuCode" placeholder="sku编码" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="价格(单位:分)"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.price" placeholder="价格" clearable />
          </template>
        </el-table-column>

        <el-table-column
          label="销量"
          align="center"
        >
          <template slot-scope="scope">
            <el-input v-model="scope.row.sale" placeholder="销量" clearable />
          </template>
        </el-table-column>
        <!-- type="index" -->

        <el-table-column
          fixed="right"
          width="150px"
          label="操作"
          align="center"
        >
          <template slot-scope="scope">
            <el-button type="text" size="mini" style="color:red;" @click="del(scope.row.id,scope.$index)">删除</el-button>
            <el-button type="text" size="mini" @click="Editsku(scope.row.id,scope.row.tempId)">{{ scope.row.id?'修改编辑':'保存' }}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-row v-if="!skuForm.length" :gutter="20" class="margin-30">
        <el-col :span="24" :offset="0">
          <div class="no" style="width: 100%;height: 100px;line-height: 100px; background-color: #cfd6dd;text-align: center;">
            暂无sku列表
          </div>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="6" :offset="22">
          <el-button style="margin-top:20px ;" @click="dialogFormVisible = false">取 消</el-button>
        </el-col>
      </el-row>
      <!-- </el-form> -->

    </el-dialog>

  </div>
</template>
<script>
import { findAllBrand, productsByPage, delProductDetail, getSkusByProductId, updateSkuInfo, delSku, addProductSkus } from '@/api/product/productList/index'
import mix from '@/mixins/index'
import { v4 as uuidv4 } from 'uuid'
export default {
  // 当前页面的name
  name: 'ProductList',
  mixins: [mix],
  data() {
    return {
      // 上架状态 搜索的时候传进去
      ListingStatus: '',
      rules: {},
      // 查询搜索表单内容
      searchProductFrom: {},
      // 品牌的下拉菜单
      BrandList: [],
      // 商品列表
      produceList: [],
      // sku编辑框
      dialogFormVisible: false,

      // sku编辑框里面的数据
      skuForm: [],
      // 让图片上传的唯一标识
      tempId: '',

      productId: '',
      // 设置临时的上传
      tempSkuUpload: []
    }
  },
  created() {
    this.getBandList()
    this.getProductList()
  },
  mounted() {},
  methods: {
    // 获取筛选框的品牌数据
    async getBandList() {
      const res = await findAllBrand()
      console.log(res)
      const { success, data, message } = res
      if (success) {
        this.BrandList = data.items
      } else {
        this.$message.error(message)
      }
    },
    // 获取商品列表
    async getProductList() {
      const res = await productsByPage(this.pagination.start, this.pagination.limit, this.searchProductFrom)
      console.log(res)
      const { success, data, message } = res
      if (success) {
        this.produceList = data.rows
        this.pagination.total = data.total
      } else {
        this.$message.error(message)
      }
    },
    // 重置from 搜索表单
    resectFrom() {
      this.searchProductFrom = this.$options.data().searchProductFrom
      this.ListingStatus = this.$options.data().ListingStatus
      this.getProductList()
    },
    // 点击搜索
    SeachFrom() {
      this.searchProductFrom.publishStatus = this.ListingStatus
      this.getProductList()
    },
    // 点击新增产品
    addProduct() {
      this.$router.push({ name: 'AddProduct' })
    },
    // limit发生改变
    sizeChange(val) {
      this.pagination.limit = val
      this.pagination.start = 1
      this.getProductList()
    },
    // 当前页码变化
    currentChange(val) {
      this.pagination.start = val
      this.getProductList()
    },

    // 点击编辑EditSkuLog  弹出对话框回显
    async EditSkuLog(id) {
      this.productId = id
      this.dialogFormVisible = true
      const res = await getSkusByProductId(id)
      const { success, data, message } = res
      console.log(res)
      if (success) {
        this.skuForm = data.items

        this.skuForm.forEach(item => {
        // 先给他转换成JSON数组
          const PrAttr = JSON.parse(item.spData)

          // 这里遍历每一个spdata
          PrAttr.forEach((SpdataItem, index) => {
          // 转换成字符串 拼接在同一行
            if (index === 0) {
              this.$set(item, 'color', SpdataItem.value)
            }
            this.$set(item, 'size', SpdataItem.value)
          })
        })
        // console.log(this.skuForm)
      } else {
        this.$message.error(message)
      }
    },
    // 点击新增sku空的
    addSkuList() {
      this.skuForm.push({
        // 设置一个临时id 让他的img  和 删除 可以找到对应的数据
        tempId: uuidv4(), // 随机 唯一的值 uuid
        // id: uuidv4(), // 随机 唯一的值 uuid
        'lockStock': '', // 锁定库存   应该是手动设置
        'lowStock': '', // 库存警戒线
        'pic': '', // 图片  需要上传
        'price': '', // 当前价格
        'promotionPrice': '', // 单品促销价格
        'sale': '', // 销量
        'skuCode': '', // sku的编码,手动填写
        // 下面的字段到最后提交数据的时候再转换成这样
        // 'spData': JSON.stringify({ 'key': '', 'value': '' }, { 'key': '', 'value': '' }), // sku属性，json格式String类型 ,
        // 'spData': { color: { value: '' }, size: { value: '' }}, // 使用对象来保存颜色和大小的属性
        color: '',
        size: '',
        'stock': '' // 库存
      })
    },
    // 上传SkuPic图片 成功
    handleSkuPicSuccess(res) {
      // 这里使用find 返回符合条件的元素  找到
      const item = this.skuForm.find(item => item.tempId === this.tempId)
      if (item) {
        const { success, data, message } = res
        if (success) {
          item.pic = data.fileUrl
          // 成功之后 清空tempId
          this.tempId = ''
        } else {
          this.$message.error(message)
        }
      }
    },
    // Sku图片点击上传  这里拿到了当前row的id添加图片
    hanleSkuPicEvent(tempId) {
      // 这里拿到当前row的id 赋值给了临时的tempId   在上传成功可以使用
      this.tempId = tempId
    },

    // 点击删除当前创建的sku的这一行
    del(id, idx) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delSku(id)
        const { success, message } = res
        if (success) {
          this.$message.success('删除成功')
          // 这里直接操作他的索引 通过索引直接删除元素 更新视图
          this.skuForm.splice(idx, 1)
          // 这里拿到当前row的id  在删除当前行也可以使用
          // this.tempId = tempId
          // // 这里是 过滤出符合条件的元素 再赋值一遍就可以
          // this.skuForm = this.skuForm.filter(item => item.tempId !== this.tempId)
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
    // 用于修改之前规整数据
    filterSku(id) {
      const tempSkuList = []
      // 先找到当前要保存的sku
      this.skuForm.map(item => {
        if (item.id === id) {
          // 这里的其他参数 都已经在this.pmsSkustock里面了 用了结构赋值 ...item
          tempSkuList.push({ ...item,
            spData: JSON.stringify([
              { key: '颜色', value: item.color },
              { key: '容量', value: item.size }
            ]) // sku属性，接口要求json格式String类型 ,
          })
        }
      })
      // 修改好颜色和容量参数后 再次赋值
      this.tempSkuUpload = tempSkuList
    },

    // 点击修改编辑sku
    async Editsku(id, tempId) {
      if (id) {
        // 判断当前是否有id  如果有就是更新编辑
        this.filterSku(id)
      } else {
        const tempSkuList = []
        // 先找到当前要保存的sku
        this.skuForm.map(item => {
          if (item.tempId === tempId) {
            // 这里的其他参数 都已经在this.pmsSkustock里面了 用了结构赋值 ...item
            tempSkuList.push({ ...item,
              promotionPrice: 100,
              productId: this.productId,
              spData: JSON.stringify([
                { key: '颜色', value: item.color },
                { key: '容量', value: item.size }
              ]) // sku属性，接口要求json格式String类型 ,
            })
          }
        })
        // 修改好颜色和容量参数后 再次赋值
        this.tempSkuUpload = tempSkuList
      }

      const api = id ? updateSkuInfo : addProductSkus
      const res = await api(this.tempSkuUpload[0])

      const { success, message } = res
      if (success) {
        this.$message.success('修改成功')
        this.EditSkuLog(this.productId)
      } else {
        this.$message.error(message)
      }
    },

    // 上传skuPic图片上传之前校验
    beforeSkuPicUpload(file) {
      // this.checkImg(file) 混入在mix的校验图片的方法
      return this.checkImg(file)
    },
    // 点击编辑 当前商品 跳转到编辑
    EditcurrProduct(id) {
      this.$router.push({ name: 'EditProduct', params: { id }})
    },
    // 点击删除当前产品
    async delProduct(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        const res = await delProductDetail(id)
        const { success, message } = res
        if (success) {
          this.$message.success('删除成功')
          this.getProductList()
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

    // 潘佳辰封装好的 过滤方法
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
        return v[j] // 从v里面取出j的值
      }))
    },
    // 点击导出商品列表excel文件
    exportProduct() {
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['名称', 'ID', '商品图片', '创建日期']// 自定义的导出表头
        const filterVal = ['name', 'id', 'pic', 'createTime'] // 对应表头的值
        const list = this.produceList //  过滤的数据源
        const data = this.formatJson(filterVal, list) // 过滤出list里面的值
        excel.export_json_to_excel({
          header: tHeader, // 表头 必填
          data, // 具体数据 必填
          filename: '商品数据列表', // 非必填
          autoWidth: true, // 非必填  要不要宽度自适应
          bookType: 'xlsx' // 非必填  xls和xlsx后缀名 都可以
        })
      })
    }
  }
}
</script>
//可以设置代码为scss  lang='scss'
<style lang='scss' scoped>

::v-deep .el-collapse-item {
  padding-left: 16px;
  padding-bottom: 10px;
  background-color: #fff;
}
.productList {
  ::v-deep .el-form-item__label {
    font-weight: normal;
  }
}
.margin {
  margin: 20px;
}
::v-deep .el-dialog{
  width: 65%;
}
</style>
