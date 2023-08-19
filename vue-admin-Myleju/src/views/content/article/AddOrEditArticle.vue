<template>
  <div class="add">
    <el-card shadow="never">
      <div slot="header">
        <span>{{ articleId?'编辑文章':'新增文章' }}</span>
      </div>
      <!-- 这里使用了rules校验规则校验 -->
      <el-form
        ref="articleForm"
        :model="article"
        :rules="rules"
        label-width="120px"
        size="mini"
      >
        <el-row :gutter="20">
          <el-col :span="6" :offset="0">
            <el-form-item label="作者" prop="author">
              <el-input v-model="article.author" placeholder="作者姓名" />
            </el-form-item>
          </el-col>
          <el-col :span="6" :offset="0">
            <el-form-item label="标题" prop="title">
              <el-input v-model="article.title" placeholder="文章标题" />
            </el-form-item>
          </el-col>
          <el-col style="" :span="6" :offset="1">
            <el-form-item label="是否显示" prop="isShow">
              <el-switch
                v-model="article.isShow"
                :active-value="1"
                :inactive-value="0"
                active-color="#13ce66"
                inactive-color="#dcdfe6"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="13" :offset="0">
            <el-form-item label="摘要" prop="summary">
              <el-input
                v-model="article.summary"
                type="textarea"
                :rows="2"
                placeholder="摘要"
              />
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="13" :offset="0">
            <el-form-item label="封面图片" prop="coverImg">
              <el-upload
                ref="coverImgUplaod"
                :action="uploadFile"
                :headers="token"
                :on-success="handlerCoverImgsucc"
                :before-upload="beforeCoverImgUpload"
              >
                <img
                  v-if="article.coverImg"
                  width="80px"
                  height="80"
                  :src="article.coverImg"
                  alt=""
                >
                <el-button
                  v-else
                  size="small"
                  type="primary"
                >点击上传</el-button>
                <div slot="tip" class="el-upload__tip">
                  只能上传jpg/png/webp文件，且不超过1.5M
                </div>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="12" :offset="0">
            <el-form-item label="切换富文本类型" prop="editorType">
              <!-- editorType (integer, optional): 编辑器类型: 0 富文本; 1 markdown , -->
              <!-- 这里需要的是整数  所以需要加: -->
              <el-radio
                v-model="article.editorType"
                :label="0"
                border
                @change="editorTypeChange"
              >富文本</el-radio>
              <el-radio
                v-model="article.editorType"
                :label="1"
                border
                @change="editorTypeChange"
              >markdown</el-radio>
              <span style="color: #e6a23c; margin-right: 10px">
                <i style="margin-right: 5px" class="el-icon-warning-outline" />
                注意!切换编辑器会清空编辑内容</span>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col :span="24" :offset="0">
            <!-- 使用他写好的富文本编辑器  -->
            <Tinymcs
              v-if="article.editorType === 0"
              v-model="article.content1"
            />
            <!-- markdown编辑器 -->
            <mavon-editor
              v-if="article.editorType === 1"
              ref="mavonEdit"
              v-model="article.content1"
              @imgAdd="$imgAdd"
            />
          </el-col>
        </el-row>

        <el-row :gutter="20">
          <el-col
            :span="24"
            :offset="0"
            style="text-align: center; margin-top: 20px"
          >
            <el-button type="primary" @click="AddOrEditArticle">{{ articleId?'立即修改':'立即新增' }}</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
</template>
<script>
import { addArticle, productArticle, updateArticle } from '@/api/comtent/article/index'
// 导入富文本编辑
import Tinymcs from '@/components/Tinymce'
import mix from '@/mixins/index'
import { getToken } from '@/utils/Myauth'
import axios from 'axios'
export default {
  // 当前页面的name
  name: 'AddOrEditArticle',
  // 注册富文本编辑器
  components: { Tinymcs },
  // 混入mixins
  mixins: [mix],
  data() {
    return {
      articleId: '',
      article: {
        editorType: 0
      },
      rules: {
        // trigger:blur   失去焦点触发
        // message:     不符合条件的时候显示的提示文字
        author: [
          { required: true, message: '作者必须填', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在3 - 5个字符', trigger: 'blur' }
        ],
        title: [
          { required: true, message: '标题必须填', trigger: 'blur' },
          { min: 5, max: 10, message: '长度在5-10个字符', trigger: 'blur' }
        ],
        isShow: [{ required: true, message: 'isShow必须填', trigger: 'blur' }],
        summary: [{ required: true, message: 'summary', trigger: 'blur' }],
        coverImg: [{ required: true, message: 'coverImg', trigger: 'blur' }],
        content1: [
          { required: true, message: 'content1必须填', trigger: 'blur' }
        ]
      }
    }
  },

  created() {
    // 一进来获取点击编辑按钮  传进来的id
    this.articleId = this.$route.params.id
    // 先判断是否有id  有id就是编辑 没有id就是正常添加
    if (this.articleId) {
      this.getArticleDetail()
    }
  },
  mounted() {

  },
  methods: {
    // 根据传进来的id  获取文章详情
    async getArticleDetail() {
      const res = await productArticle(this.articleId)
      const { success, data, message: msg } = res
      if (success) {
        // 拿到的值 赋值给表单
        this.article = data.productArticle
      } else {
        this.$message.error(msg)
      }
    },

    // 调用图片上传的函数触发   拿到他的响应结果response
    handlerCoverImgsucc(response) {
      const { success, data, message } = response
      if (success) {
        // 使用$set(对象,'属性'，属性值)  让他变成一个响应式的数据
        this.$set(this.article, 'coverImg', data.fileUrl)

        // 上传完成之后    去掉上传的文件列表clearFiles()
        this.$refs.coverImgUplaod.clearFiles()
      } else {
        this.$message.error(message)
      }
    },
    // 上传封面文件  之前触发的钩子函数   判断是否符合条件 这里使用正则来校验
    beforeCoverImgUpload(file) {
      // file 拿到的是图片信息
      console.log(file)
      const isLt1dotM = file.size / 1024 / 1024 < 1.5

      // 使用正则校验
      const reg = /^image\/(jpeg|jpg|png|webp)$/
      const isImg = reg.test(file.type)

      if (!isImg) {
        this.$message.error('上传头像图片只能是 jpeg|jpg|png|webp 格式!')
      }
      if (!isLt1dotM) {
        this.$message.error('上传头像图片大小不能超过 1.5MB!')
      }
      return isImg && isLt1dotM
    },

    // 设置点击切换富文本和markdown的时候 内容清空
    editorTypeChange() {
      this.article.content1 = ''
    },

    // 绑定@imgAdd event
    $imgAdd(pos, $file) {
      // 第一步.将图片上传到服务器.
      var formdata = new FormData()
      formdata.append('file', $file)
      axios({
        url: this.uploadFile,
        method: 'post',
        data: formdata,
        headers: { 'token': getToken() }
      }).then((res) => {
        const { success, data, message: msg } = res.data
        if (success) {
          // 这里的pos 代表的是鼠标光标当前所在位置
          this.$refs.mavonEdit.$img2Url(pos, data.fileUrl)
        } else {
          this.$message.error(msg)
        }
      })
    },

    // 点击获取当前markdown 的实例  获取他上面的属性和方法  拿到他的html文档
    AddOrEditArticle() {
      // valid 布尔类型  判断是否符合条件 返回true
      // 这里的object  代表的是错误信息  里面显示那个属性没有通过校验
      this.$refs.articleForm.validate(async(valid, object) => {
        // 这里要正则校验 判断是否成功
        if (valid) {
          // 这里要判断 当前是哪一个编辑器 根据类型再添加html文档
          // 富文本的原文和她的html都是一样的  只有markdown的不一样
          if (this.article.editorType === 0) {
            this.article.content2 = this.article.content1
          } else if (this.article.editorType === 1) {
            // 这里是设置markdown的content2
            this.article.content2 = this.$refs.mavonEdit.d_render
          }

          // 判断当前是否是编辑 或者是 新增
          const Fn = this.articleId ? updateArticle : addArticle
          const res = await Fn(this.article)

          const { success, message } = res
          if (success) {
            this.$router.push({ name: 'Article' })
          } else {
            this.$message.error(message)
          }
        } else {
          // 这里的else基本没用  可以直接删掉
          console.log(object)
        }
      })
    }
  }
}
</script>
//可以设置代码为scss  lang='scss'
<style lang='scss' scoped>
.add {
  padding: 20px;
}
.add {
  ::v-deep .el-form-item__label {
    font-weight: normal;
  }
}
</style>
