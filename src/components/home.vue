<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout clearfix">
        <a @click="logout" class="fr" href="javascript:;">
          退出
        </a>
        <span class="fr">欢迎光临</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">Aside</el-aside>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      this.$confirm('您确定要退出系统吗?', '温馨提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      })
    }
  }
}
</script>

<style lang = 'less' scoped>
  .home{
    height: 100%;
    .el-header{
      width: 100%;
      height: 60px;
      background-color: #b3c1cd;
      display: flex;
      .logo{
        width: 180px;
        background: url('~@/assets/imgs/logo.1.png');
        background-size: contain;
        background-position: center;
        background-repeat: no-repeat;
      }
      .title{
        flex: 1;
        text-align: center;
        color: #ffffff;
        line-height: 60px;
      }
      .logout{
        width: 180px;
        line-height: 60px;
        span{
          font-weight: 700;
          margin-right: 10px;
        }
        a{
          color: orange;
          text-decoration: none;
        }
      }
    }
    .el-aside{
      background-color: #545c64;
    }
    .el-main{
      background-color: #D4DFE4;
    }
  }
</style>
