<template>
  <el-container class="home">
    <el-header>
      <div class="logo"></div>
      <div class="title">
        <h1>电商后台管理系统</h1>
      </div>
      <div class="logout clearfix">
        <a @click="logout" class="fr" href="javascript:;">退出</a>
        <span class="fr">欢迎光临</span>
      </div>
    </el-header>
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="$route.path.slice(1)"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
          unique-opened
          router
        >
          <el-submenu v-for="v1 in menuList" :key="v1.id" :index="v1.path">
            <template slot="title">
              <i class="el-icon-location"></i>
              <span>{{ v1.authName }}</span>
            </template>
            <el-menu-item-group>
              <el-menu-item v-for="v2 in v1.children" :key="v2.id" :index="v2.path">
                <i class="el-icon-menu"></i>
                {{ v2.authName }}
              </el-menu-item>
            </el-menu-item-group>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      menuList: []
    }
  },
  methods: {
    async logout() {
      try {
        await this.$confirm('您确定要退出系统吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        this.$message({
          type: 'success',
          message: '退出成功!'
        })
        localStorage.removeItem('token')
        this.$router.push('/login')
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消'
        })
      }
    },
    async getList() {
      let res = await this.axios({
        method: 'get',
        url: 'menus'
      })
      if (res.meta.status === 200) {
        // console.log(res)
        this.menuList = res.data
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang = 'less' scoped>
.home {
  height: 100%;
  .el-header {
    width: 100%;
    height: 60px;
    background-color: #b3c1cd;
    display: flex;
    .logo {
      width: 180px;
      background: url('~@/assets/imgs/logo.1.png');
      background-size: contain;
      background-position: center;
      background-repeat: no-repeat;
    }
    .title {
      flex: 1;
      text-align: center;
      color: #ffffff;
      line-height: 60px;
    }
    .logout {
      width: 180px;
      line-height: 60px;
      span {
        font-weight: 700;
        margin-right: 10px;
      }
      a {
        color: orange;
        text-decoration: none;
      }
    }
  }
  .el-aside {
    background-color: #545c64;
    .el-submenu {
      width: 200px;
    }
  }
  .el-main {
    background-color: #d4dfe4;
  }
}
</style>
