<template>
  <div class="productDetail">
    <!-- 进度条 -->
    <el-steps :active="step" finish-status="success">
      <el-step title="商品基本信息" />
      <el-step title="添加库存信息" />
      <el-step title="添加移动端详情" />
    </el-steps>
    <!-- 卡片 -->
    <el-card shadow="never" style="margin:30px;">
      <el-form
        ref="productFrom"
        :model="product"
        :rules="rules"
        label-width="140px"
        :inline="false"
        size="mini"
      >
        <div v-show="step === 1">
          <div class="common-title">
            <p class="title">基本信息</p>
            <el-divider class="line" />
          </div>
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="商品名称" prop="name">
                <el-input v-model="product.name" placeholder="商品名称" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <el-form-item label="商品编码" prop="productSn">
                <el-input v-model="product.productSn" placeholder="商品编码" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <el-form-item label="商品分类" prop="productCategoryId">
                <!-- 这里接口需要两个值 id和名称  这里只能绑定一个 传参数的时候 通过find找到与他数据对应的item 再给他添加上即可 -->
                <el-select v-model="product.productCategoryId" style="width: 100%;" placeholder="商品分类" clearable>
                  <el-option
                    v-for="item in lejuProductSort"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="商品品牌" prop="brandId">
                <el-select v-model="product.brandId" style="width: 100%;" placeholder="商品品牌" clearable>
                  <el-option
                    v-for="item in BrandList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="14" :offset="0">
              <el-form-item label="商品描述" prop="description">
                <el-input v-model="product.description" type="textarea" placeholder="商品描述" size="mini" clearable />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 2  商品属性-->
          <div class="common-title">
            <p class="title">商品属性</p>
            <el-divider class="line" />
          </div>
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="商品原价(单位:分)">
                <!-- 只要是关于钱的单位 都是分  -->
                <el-input-number
                  v-model="product.originalPrice"
                  style="width: 100%;"
                  size="mini"
                  label="商品原价"
                  :min="0"
                  :controls="true"
                  controls-position="both"
                />

              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <el-form-item label="促销类型">
                <!-- 促销类型：
                  0->没有促销使用原价;
                  1->使用促销价；
                  2->使用会员价；
                  3->使用阶梯价格；
                  4->使用满减价格；
                  5->限时购 , -->
                <!-- <el-input v-model="product.promotionType" placeholder="促销类型" size="normal" clearable @change=""></el-input> -->
                <el-select v-model="product.promotionType" style="width: 100%;" disabled placeholder="没有促销 使用原价" clearable>
                  <el-option
                    v-for="item in promotionTypeList"
                    :key="item.value"
                    :label="item.text"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <el-form-item label="活动价格(单位:分)">
                <!-- 只要是关于钱的单位 都是分  -->
                <el-input-number
                  v-model="product.promotionType"
                  disabled
                  style="width: 100%;"
                  size="mini"
                  :min="0"
                  :controls="true"
                  controls-position="both"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="重量(kg)">
                <!-- 只要是关于钱的单位 都是分  -->
                <el-input-number
                  v-model="product.weight"
                  style="width: 100%;"
                  size="mini"
                  label="重量(kg)"
                  :min="0"
                  :controls="true"
                  controls-position="both"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 审核状态 -->
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="审核状态">
                <el-switch v-model="product.verifyStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <!-- publishStatus  上架状态：0->下架；1->上架 , -->
              <el-form-item label="是否上架">
                <el-switch v-model="product.publishStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>

          <!-- 略缩图 -->
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="缩略图" prop="pic">
                <el-upload
                  class="avatar-uploader"
                  :action="uploadFile"
                  :show-file-list="false"
                  :on-success="handleCoverImgSuccess"
                  :before-upload="beforeCoverImgUpload"
                  :headers="token"
                >
                  <img v-if="product.pic" width="100" height="100" :src="product.pic" class="avatar">
                  <i v-else class="el-icon-plus avatar-uploader-icon" />
                </el-upload>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- 3  其他信息-->
          <div class="common-title">
            <p class="title">其他信息</p>
            <el-divider class="line" />
          </div>
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <!--  推荐状态；0->不推荐；1->推荐 , 'recommendStatus': 0, -->
              <el-form-item label="推荐状态">
                <el-switch v-model="product.recommendStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <!-- 'newStatus': 0, // 新品状态:0->不是新品；1->新品 ,新品会在移动端首页推荐 -->
              <el-form-item label="新品状态">
                <el-switch v-model="product.newStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <!-- 'previewStatus': 0, // 是否为预告商品：0->不是；1->是  -->
              <el-form-item label="预告商品">
                <el-switch v-model="product.previewStatus" :active-value="1" :inactive-value="0" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="7" :offset="0">
              <el-form-item label="搜索关键词" prop="keywords">
                <!-- 'keywords': 'string', // 关键词,逗号分割,  地中海,凳子,xxx -->
                <el-input v-model="product.keywords" placeholder="搜索关键词" size="mini" clearable />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <el-form-item label="库存预警">
                <!-- 'lowStock': 0, // 预警库存(预留) -->
                <el-input-number
                  v-model="product.lowStock"
                  style="width: 100%;"
                  size="mini"
                  label="库存预警"
                  :min="0"
                  :controls="true"
                  controls-position="both"
                />
              </el-form-item>
            </el-col>
            <el-col :span="7" :offset="0">
              <el-form-item label="商品排序" prop="sort">
                <!-- 'sort': 0, // 排序,降序.值越大越靠前 -->
                <el-input-number
                  v-model="product.sort"
                  style="width: 100%;"
                  size="mini"
                  label="商品排序"
                  :min="0"
                  :controls="true"
                  controls-position="both"
                />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <!-- //  以逗号分割的产品服务：1->无忧退货；2->快速退款；3->免费包邮 ???, -->
              <!-- 'serviceIds': 'string', // 1,2 -->
              <!--   这里v-model是serviceIds数组        接口要求是字符串 需要在上传的时候把他里面的值转换为字符串-->
              <el-form-item label="产品服务">
                <el-checkbox-group v-model="product.serviceIds">
                  <el-checkbox label="1">无忧退货</el-checkbox>
                  <el-checkbox label="2">快速退款</el-checkbox>
                  <el-checkbox label="3">免费包邮</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-col>
          </el-row>
        </div>
        <div v-show="step === 2">
          <!-- 2.1  商品sku信息-->
          <div class="common-title">
            <p class="title">商品sku信息</p>
            <el-divider class="line" />
          </div>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="标题" prop="detailTitle">
                <el-input v-model="product.detailTitle" placeholder="标题" size="mini" />
              </el-form-item>
            </el-col>
            <el-col :span="12" :offset="0">
              <el-form-item label="副标题" prop="detailDesc">
                <el-input v-model="product.detailDesc" placeholder="副标题" size="mini" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="8" :offset="0">
              <el-form-item label="画册图片">
                <div>
                  <div class="imgs">
                    <el-upload
                      ref="pictureFile"
                      :action="uploadFile"
                      :headers="token"
                      list-type="picture-card"
                      multiple
                      :limit="5"
                      :file-list="product.albumPicsCopy"
                      :on-success="handleDrawImgSucc"
                      :before-upload="beforeCoverImgUpload"
                    >
                      <i slot="default" class="el-icon-plus" />
                      <div slot="file" slot-scope="{file}">
                        <img
                          class="el-upload-list__item-thumbnail"
                          :src="file.url"
                          alt=""
                        >
                        <span class="el-upload-list__item-actions">
                          <span
                            class="el-upload-list__item-preview"
                            @click="handlePictureCardPreview(file)"
                          >
                            <i class="el-icon-zoom-in" />
                          </span>
                          <span
                            v-if="!disabled"
                            class="el-upload-list__item-delete"
                            @click="handleRemove(file)"
                          >
                            <i class="el-icon-delete" />
                          </span>
                        </span>
                      </div>
                    </el-upload>
                  </div>
                  <el-dialog :visible.sync="dialogVisible">
                    <img width="100%" :src="dialogImageUrl" alt="">
                  </el-dialog>
                  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件,且不超过500kb,文件不超过5个</div>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          <!-- sku设置 -->
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-form-item label="sku设置">
                <div v-if="tempSkuColor.list.length">
                  <span style="font-size: 14px;">颜色：</span>
                  <!-- 这里绑定选中的数组 -->
                  <el-checkbox-group v-model="tempSkuColor.checkedList" style="display: inline-block;">
                    <!-- 这里绑定的是全部的颜色选项 -->
                    <el-checkbox v-for="item in tempSkuColor.list" :key="item" :label="item">
                      {{ item }} <span style="margin-left: 20px; color: red;font-size: 14px;" @click.stop="DelOpction('color',item)">删除</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <div v-if="tempSkuSize.list.length">
                  <span style="font-size: 14px;">大小：</span>
                  <!-- 这里绑定选中的数组 -->
                  <el-checkbox-group v-model="tempSkuSize.checkedList" style="display: inline-block;">
                    <!-- 这里绑定的是全部的颜色选项 -->
                    <el-checkbox v-for="item in tempSkuSize.list" :key="item" :label="item">
                      {{ item }} <span style="margin-left: 20px; color: red;font-size: 14px;" @click.stop="DelOpction('size',item)">删除</span>
                    </el-checkbox>
                  </el-checkbox-group>
                </div>

                <el-input v-model="tempSkuColor.text" style="width: 200px;" placeholder="颜色描述: 比如土豪金" @keyup.enter.native="createOpction('color')" />
                <el-button style="margin:0 20px;" size="mini" @click="createOpction('color')">创建颜色选项</el-button>
                <el-input v-model="tempSkuSize.text" style="width: 200px;" placeholder="大小:例如128G" @keyup.enter.native="createOpction('size')" />
                <el-button style="margin:0 20px;" size="mini" @click="createOpction('size')">创建大小选项</el-button>
                <el-button style="margin-left:80px;" type="primary" size="mini" @click="buildSkuList">生成sku列表</el-button>
                <el-button type="primary" size="mini" @click="doBuildSkuList">新增sku</el-button>
                <!-- 新增sku列表 table -->
                <el-table v-if="pmsSkuStockList.length" :data="pmsSkuStockList" border stripe class="margin-30">
                  <el-table-column
                    fixed="left"
                    type="index"
                    label="#"
                    align="center"
                    width="50"
                  />
                  <el-table-column
                    label="图片"
                    align="center"
                    width="120"
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

                  <el-table-column
                    fixed="right"
                    type="index"
                    label="操作"
                    width="100px"
                    align="center"
                  >
                    <template slot-scope="scope">
                      <el-button type="text" size="mini" style="color:red;" @click="del(scope.$index)">删除</el-button>
                    </template>

                  </el-table-column>

                  <!-- <template slot-scope="scope"> -->
                  <!-- <el-button type="text" size="mini" style="color:red;" @click="del(scope.row.tempId)">删除</el-button> -->

                  <!-- <el-button type="text" size="mini" style="color:red;" @click="del(index)">删除</el-button> -->

                  <!-- </template> -->
                  <!-- </el-table-column> -->
                </el-table>

              </el-form-item>
            </el-col>
          </el-row>
        </div>

        <!-- 3 详情描述 富文本编辑器 -->
        <div v-show="step === 3">
          <!-- 3.1  详情描述-->
          <div class="common-title">
            <p class="title">详情描述</p>
            <el-divider class="line" />
          </div>
          <el-row :gutter="20">
            <el-col :span="24" :offset="0">
              <el-form-item label="商品详情" prop="detailMobileHtml">
                <!-- 使用他写好的富文本编辑器  -->
                <Tinymcs v-model="product.detailMobileHtml" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="20" :offset="0">
              <el-form-item label="备注">
                <el-input
                  v-model="product.note"
                  type="textarea"
                  :rows="2"
                  placeholder="备注:比如小舅子供货不入账"
                />
              </el-form-item>
            </el-col>
          </el-row>

        </div>

        <div class="btn">
          <el-button
            v-if="step !== 1"
            class="pre"
            size="mini"
            @click="pre"
          >返回上一步</el-button>
          <el-button v-if="step !== 3" type="primary" size="mini" @click="next">
            {{ step === 1 ? '下一步,填写库存信息' : '下一步,填写移动端详情' }}
          </el-button>
          <el-button
            v-if="step == 3"
            type="primary"
            size="mini"
            @click="doAddProduct"
          >{{ productId?'保存编辑':'点击保存' }}</el-button>
        </div>
      </el-form>

    </el-card>
  </div>
</template>
<script>
// 导入富文本编辑
import Tinymcs from '@/components/Tinymce'
import { v4 as uuidv4 } from 'uuid' // 这是导入uuid
import { getAllCategory, findAllBrand, addProductAndSkus, ProductDetail, updateProductAndSkus } from '@/api/product/productList/index'
import mix from '@/mixins/index'
export default {
  // 当前页面的name
  name: 'AddProduct',
  // 注册富文本编辑器
  components: { Tinymcs },
  mixins: [mix],
  data() {
    return {
      // 产品大表单数据集合
      product: {
        originalPrice: 0, // 原价
        weight: 0, // 重量
        lowStock: 0, // 最低库存预警
        sort: 0, // 商品排序
        pic: '', // 缩略图
        serviceIds: [], // 产品服务
        albumPicsCopy: [], // 画册上传的图片数组
        promotionType: 0 // 促销类型  没有
      },
      // 生成sku颜色选项
      tempSkuColor: {
        text: '', // 颜色选项
        list: ['土豪金', '玫瑰金'], // 创建好的color数组
        checkedList: []// 选中的color数组
      },
      // 生成sku大小size选项
      tempSkuSize: {
        text: '', // 颜色选项
        list: ['64G', '128G'], // 创建好的color数组
        checkedList: []// 选中的color数组
      },
      pmsSkuStockList: [], // 新增的sku列表
      tempId: '', // 临时的id 供图片上传

      // 当前是第几步骤
      step: 1,
      // 商品分类
      lejuProductSort: [],
      // 品牌的下拉菜单
      BrandList: [],

      promotionTypeList: [
        {
          text: '没有促销使用原价',
          value: 0
        },
        {
          text: '使用促销价',
          value: 1
        },
        {
          text: '使用会员价',
          value: 2
        },
        {
          text: '使用阶梯价格',
          value: 3
        },
        {
          text: '使用满减价格',
          value: 4
        },
        {
          text: '限时购',
          value: 5
        }
      ],

      dialogImageUrl: '',
      dialogVisible: false,
      disabled: false,

      // 表单校验 规则
      rules: {
        name: [{ required: true, message: '商品名称未填写', trigger: 'blur' }],
        productSn: [{ required: true, message: '商品编码未填写', trigger: 'blur' }],
        productCategoryId: [{ required: true, message: '商品分类未填写', trigger: 'blur' }],
        brandId: [{ required: true, message: '商品品牌未填写', trigger: 'blur' }],
        description: [{ required: true, message: '商品描述未填写', trigger: 'blur' }],
        keywords: [{ required: true, message: '搜索关键词未填写', trigger: 'blur' }],
        pic: [{ required: true, message: '缩略图未上传', trigger: 'blur' }],
        sort: [{ required: true, message: '商品排序', trigger: 'blur' }],

        // 第二页
        detailTitle: [{ required: true, message: '标题未填写', trigger: 'blur' }],
        detailDesc: [{ required: true, message: '副标题未填写', trigger: 'blur' }],

        // 第三页
        detailMobileHtml: [{ required: true, message: '商品详情未填写', trigger: 'blur' }]
      },

      // 部分表单校验  第一页
      firstPageFiled: ['name', 'productSn', 'productCategoryId', 'brandId', 'description', 'keywords', 'pic', 'sort'],
      // 第二页
      secondPageFiled: ['detailTitle', 'detailDesc'],
      // 第三页
      thirdPageFiled: ['detailMobileHtml'],

      // 用户id  如果有id那就编辑
      productId: ''
    }
  },
  created() {
    this.productId = this.$route.params.id
    this.getProduceSort()
    this.getBandList()
    // 判断如果有id  调取当前的用户信息用于回显
    if (this.productId) {
      this.getProductDetail()
    }
  },
  mounted() {},
  methods: {
    // getProductDetail 获取当前商品信息
    async getProductDetail() {
      const res = await ProductDetail(this.productId)
      console.log('产品详细信息==》', res)
      const { success, data, message } = res
      if (success) {
        // 回显的时候 修改产品服务字段 为数组
        data.product.serviceIds = data.product.serviceIds.split(',')

        // 回显画册的时候需要把字符串先转成数组
        data.product.albumPics = data.product.albumPics.split(',')

        const tempAlbumPics = []
        data.product.albumPics.forEach(item => {
          tempAlbumPics.push({
            // 这里+1是因为还包含这个元素 要从他后面截取
            name: item.substring(item.lastIndexOf('/') + 1),
            url: item
          })
        })
        // ？
        data.product.albumPicsCopy = tempAlbumPics
        console.log(data.product.albumPics)
        this.product = data.product
        this.albumPicsCopy = data.product.albumPicsCopy

        // 操作skus
        data.skus.forEach(item => {
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

        this.pmsSkuStockList = data.skus
        console.log('添加color之后', this.pmsSkuStockList)
      } else {
        this.$message.error(message)
      }
    },

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

    // 获取商品分类
    async getProduceSort() {
      const res = await getAllCategory()
      console.log(res)
      const { success, data, message } = res
      if (success) {
        // 这里需要遍历出乐居的分类
        const lejuCategory = data.items.find(item => item.category.name === '乐居')
        this.lejuProductSort = lejuCategory.children
      } else {
        this.$message.error(message)
      }
    },
    // 缩略图上传成功之后触发
    handleCoverImgSuccess(res) {
      const { success, data, message } = res
      if (success) {
        // 这样直接赋值不是响应式的  可以在data提前声明一下
        this.product.pic = data.fileUrl
      } else {
        this.$message.error(message)
      }
    },
    // 缩略图上传之前触发 file 拿到上传的文件信息 判断大小
    beforeCoverImgUpload(file) {
      // 使用mixins 封装的图片校验函数
      return this.checkImg(file)
    },
    // 画册图片上传成功后触发
    handleDrawImgSucc(res) {
      console.log('画册上传成功', res)
      const { success, data, message } = res
      if (success) {
        // 这里成功之后 需要根据productId 当前上传的格式
        if (this.productId) {
          this.product.albumPicsCopy.push({
            name: data.fileUrl.substring(data.fileUrl.lastIndexOf('/') + 1),
            url: data.fileUrl
          })
        } else {
          // 这样直接赋值不是响应式的  可以在data提前声明一下
          this.product.albumPicsCopy.push(data.fileUrl)
        }
      } else {
        this.$message.error(message)
      }
    },
    // 画册 点击删除
    handleRemove(file) {
      console.log('画册图片删除触发', file)
      if (this.productId) {
        this.product.albumPicsCopy = this.product.albumPicsCopy.filter(item => item.uid !== file.uid)
        this.$refs.pictureFile.uploadFiles = this.$refs.pictureFile.uploadFiles.filter(item => item.uid !== file.uid)
      } else {
        console.log('画册图片else', file)
        // 点击筛选过滤出 数据
        this.product.albumPicsCopy = this.product.albumPicsCopy.filter(item => item.uid !== file.response.data.fileUrl)
        // 点击筛选过滤出图片 重新刷新
        this.$refs.pictureFile.uploadFiles = this.$refs.pictureFile.uploadFiles.filter(item => item.uid !== file.uid)
      }
    },
    // 画册预览
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 点击创建颜色选项还是 创建sku大小选项
    createOpction(type) {
      if (type === 'color') {
        // 这里需要判断是否有值 如果有值再上传
        if (this.tempSkuColor.text) {
          // 判断当前的颜色选项是否已经创建
          const item = this.tempSkuColor.list.find(item => item === this.tempSkuColor.text)
          if (!item) {
            // 添加颜色选框列表
            this.tempSkuColor.list.push(this.tempSkuColor.text)
            // 添加完成之后清空输入框数据
            this.tempSkuColor.text = ''
          } else {
            this.$message.error(this.tempSkuColor.text + '颜色选项已存在')
          }
        } else {
          this.$message.error('请输入你想创建的颜色选项')
        }
      } else {
        // 这里需要判断是否有值 如果有值再上传
        if (this.tempSkuSize.text) {
          // 判断当前的颜色选项是否已经创建
          const item = this.tempSkuSize.list.find(item => item === this.tempSkuSize.text)
          if (!item) {
            // 添加颜色选框列表
            this.tempSkuSize.list.push(this.tempSkuSize.text)
            // 添加完成之后清空输入框数据
            this.tempSkuSize.text = ''
          } else {
            this.$message.error(this.tempSkuSize.text + '当前大小选项已存在')
          }
        } else {
          this.$message.error('请输入你想创建的大小选项')
        }
      }
    },
    // 点击删除当前添加的属性
    DelOpction(type, items) {
      if (type === 'color') {
        // 需要删除两个 一个是列表 一个是已经选中的数据列表里

        this.tempSkuColor.list = this.tempSkuColor.list.filter(item => item !== items)

        // 返回第一个符合条件元素的下标
        const idx = this.tempSkuColor.checkedList.findIndex(item => item === items)
        console.log(idx)
        // 如果没找到返回-1
        if (idx !== -1) {
          this.tempSkuColor.checkedList.splice(idx, 1)
        }
      } else {
        this.tempSkuSize.list = this.tempSkuSize.list.filter(item => item !== items)
        // 返回第一个符合条件元素的下标
        const idx = this.tempSkuSize.checkedList.findIndex(item => item === items)
        // 如果没找到返回-1
        if (idx !== -1) {
          this.tempSkuSize.checkedList.splice(idx, 1)
        }
      }
    },
    // 点击生成sku 列表
    buildSkuList() {
      this.$confirm('此操作将清空sku列表,并生成新的列表, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清空sku列表  先清空所有 再生成列表
        this.pmsSkuStockList = []

        // 调用生成列表方法
        this.doBuildSkuList()
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    },
    // 生成列表
    doBuildSkuList() {
      // 先判断两个颜色和大小选中的列表不为空
      if (this.tempSkuColor.checkedList.length && this.tempSkuSize.checkedList.length) {
        for (let i = 0; i < this.tempSkuColor.checkedList.length; i++) {
          for (let j = 0; j < this.tempSkuSize.checkedList.length; j++) {
            this.pmsSkuStockList.push({
              // 设置一个临时id 让他的img  和 删除 可以找到对应的数据
              tempId: uuidv4(), // 随机 唯一的值 uuid
              // 'id': 'string', // 如果是新增 不需要
              'lockStock': 100, // 锁定库存   应该是手动设置
              'lowStock': 200, // 库存警戒线
              'pic': '', // 图片  需要上传
              'price': 1000, // 当前价格
              // 'productId': 'string', // 商品的id,如果是新增,不需要
              'promotionPrice': 100, // 单品促销价格
              'sale': 0, // 销量
              'skuCode': '', // sku的编码,手动填写
              // 下面的字段到最后提交数据的时候再转换成这样
              // spData:  [{"key":"颜色","value":"蓝色"},{"key":"容量","value":"32G"}]
              // 'spData': 'string', // sku属性，json格式String类型 ,
              'stock': 1000, // 库存
              color: this.tempSkuColor.checkedList[i],
              size: this.tempSkuSize.checkedList[j]
            })
          }
        }
      } else {
        this.$message.error('颜色和大小不能为空~')
      }
    },
    // 上传SkuPic图片 成功
    handleSkuPicSuccess(res) {
      // 这里使用find 返回符合条件的元素  找到
      const item = this.pmsSkuStockList.find(item => item.tempId === this.tempId)
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
    // 上传skuPic图片上传之前校验
    beforeSkuPicUpload(file) {
      return this.checkImg(file)
    },
    // Sku图片点击上传  这里拿到了当前row的id添加图片
    hanleSkuPicEvent(tempId) {
      // 这里拿到当前row的id 赋值给了临时的tempId   在上传成功可以使用
      this.tempId = tempId
    },
    // 点击删除当前创建的sku的这一行
    del(index) {
      this.pmsSkuStockList.splice(index, 1)
    },
    // 上一页
    pre() {
      this.step--
    },
    // 下一页
    next() {
      let field = []
      if (this.step === 1) {
        field = this.firstPageFiled
      } else if (this.step === 2) {
        field = this.secondPageFiled
      }
      // 正则判断表单  对于部分表单做校验  field是部分校验的地方
      //   校验 第一个参数是需要不分校验的prop的name对应 他的类型是Function(props: array | string, 第二个是回调callback:
      // 校验是 他第一个参数有几个校验字段 循环校验几次
      let allValidte = true
      this.$refs.productFrom.validateField(field, (errorMessage) => {
        // 校验表单如果 未通过   全部为真   才是真   一个为假都是假
        if (errorMessage) {
          allValidte = false && allValidte
        } else {
          allValidte = true && allValidte
        }
      })
      // 全部验证通过
      if (allValidte) {
        this.step++
      } else {
        this.$message.error('校验未通过')
      }
    },
    // 提交的时候触发,用于 配合接口要求
    formateParams() {
      const tempSkuList = []
      this.pmsSkuStockList.forEach(item => {
        // 这里的其他参数 都已经在this.pmsSkustock里面了 用了结构赋值 ...item
        tempSkuList.push({
          ...item,
          spData: JSON.stringify([
            { key: '颜色', value: item.color },
            { key: '容量', value: item.size }
          ]) // sku属性，接口要求json格式String类型 ,
        })
      })

      // 格式化 接口params 规范
      // 发请求之前  把分类的另一个name字段添加上
      const item = this.lejuProductSort.find(item => item.id === this.product.productCategoryId)
      if (item) {
        this.product.productCategoryName = item.name
      }
      // 把他的品牌 另一个参数品牌名称传上去
      this.product.brandName = this.BrandList.find(item => item.id === this.product.brandId).name
      // 产品服务 数组转换为字符串   用逗号分割
      this.product.serviceIds = this.product.serviceIds.join(',')

      // 修改好颜色和容量参数后 再次赋值
      this.pmsSkuStockList = tempSkuList
      // 现价和原价一样
      this.pmsSkuStockList.price = this.pmsSkuStockList.originalPrice

      this.product.unit = '台' //  单位,比如 斤/辆/台

      // 上传画册的时候需要把图片转成字符串
      // 先取出他们的url 然后把URL变成字符串
      const urlArr = []
      this.product.albumPicsCopy.forEach(item => {
        urlArr.push(item.url)
      })

      this.product.albumPics = urlArr.join(',')
    },

    // 点击提交保存
    async doAddProduct() {
      let allValidte = true
      this.$refs.productFrom.validateField(this.thirdPageFiled, (errorMessage) => {
        // 校验表单如果 未通过   全部为真   才是真   一个为假都是假
        if (errorMessage) {
          allValidte = false && allValidte
        } else {
          allValidte = true && allValidte
        }
      })
      // 全部验证通过
      if (allValidte) {
        // 修改所有的参数信息 用于接口适配
        this.formateParams()

        // 最后上传的一个大对象  一个字段一个字段的看 字段要求
        const productParams = {
          pmsSkuStockList: this.pmsSkuStockList,
          product: this.product
        }
        console.log('上传时候的参数信息', productParams)

        // 如果id存在那就是编辑保存
        const api = this.productId ? updateProductAndSkus : addProductAndSkus

        const res = await api(productParams)

        const { success, message } = res
        if (success) {
          this.$message.success('成功')
          // 跳转到商品列表
          this.$router.push({ name: 'ProductList' })
        } else {
          this.$message.error(message)
        }
      } else {
        this.$message.error('校验未通过')
      }
    }
  }
}
</script>
//可以设置代码为scss  lang='scss'
<style scoped lang='scss'>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar-uploader-icon-skuPic {
    font-size: 28px;
    color: #8c939d;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
  }

  // .avatar {
  //   width: 178px;
  //   height: 178px;
  //   display: block;
  // }

.el-steps {
  padding: 30px 330px;
  background-color: #fff;
}

.common-title {
  .title {
    margin-bottom: 10px;
  }
  .line{
    margin-top: 0px;
  }
}

::v-deep .el-form-item__label{
  font-weight: normal;
}

.btn{
  display: flex;
  justify-content: center;
  align-items: center;
margin: 30px 0;
}
.imgs{
  width: 100%;
}

::v-deep .editor-custom-btn-container{
  display: none;
}
</style>
