<template>
  <div class="login">
    <div class="img">
      <img src="@/assets/imgs/logo.png" alt>
    </div>
    <el-form
      @keyup.enter.native="login('form')"
      ref="form"
      :model="form"
      :rules="rules"
      label-width="80px"
      status-icon
    >
      <el-form-item label="用户名" prop="username">
        <el-input v-model="form.username" placeholder="请输入用户名"></el-input>
      </el-form-item>
      <el-form-item label="密码" prop="password">
        <el-input v-model="form.password" placeholder="请输入密码" type="password"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="login('form')">登录</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      form: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ]
      }
    }
  },
  methods: {
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    login(formName) {
      this.$refs[formName].validate(async valid => {
        if (!valid) return false
        let res = await this.axios({
          method: 'post',
          url: 'login',
          data: this.form
        })
        if (res.meta.status === 200) {
          this.$message({
            message: res.meta.msg,
            type: 'success',
            duration: 2000
          })
          localStorage.setItem('token', res.data.token)
          this.$router.push('/home')
        } else if (res.meta.status === 400) {
          this.$message({
            message: res.meta.msg,
            type: 'error',
            duration: 2000
          })
        }
      })
    }
  }
}
</script>

<style lang = 'less' scoped>
.login {
  width: 100%;
  height: 100%;
  background-color: #2d434c;
  padding-top: 197px;
  position: relative;
  .img {
    width: 145px;
    height: 145px;
    border-radius: 50%;
    position: absolute;
    top: 120px;
    left: 50%;
    transform: translateX(-50%);
    padding: 10px;
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
    }
  }
  .el-form {
    width: 480px;
    height: 270px;
    background-color: #fff;
    margin: 0 auto;
    padding: 74px 40px 40px 50px;
    border-radius: 20px;
  }
  .el-button:nth-child(2) {
    margin-left: 80px;
  }
}
</style>
