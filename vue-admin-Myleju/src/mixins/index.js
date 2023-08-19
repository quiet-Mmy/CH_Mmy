import { getToken } from '@/utils/Myauth'

export default {
  data() {
    return {
      // 分页器参数
      pagination: {
        start: 1,
        limit: 10,
        pageSizes: [10, 20, 30, 40],
        // 总页数
        total: 0
      },
      // 上传图片的公共接口
      uploadFile: 'http://leju.bufan.cloud/lejuAdmin/material/uploadFileOss'

    }
  },
  computed: {
    // 计算属性 返回上传头像的token  对象
    token() {
      return { token: getToken() }
    }
  },
  methods: {
    // 校验图片  checkImg
    checkImg(file) {
      // file 拿到的是图片信息
      const isLt1dotM = file.size / 1024 / 1024 < 1.5

      // 上传之前使用正则校验大小
      const reg = /^image\/(jpeg|jpg|png|webp)$/
      const isImg = reg.test(file.type)

      if (!isImg) {
        this.$message.error('上传头像图片只能是 jpeg|jpg|png|webp 格式!')
      }
      if (!isLt1dotM) {
        this.$message.error('上传头像图片大小不能超过 1.5MB!')
      }
      return isImg && isLt1dotM
    }
  }
}
