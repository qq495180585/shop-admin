<template>
  <div class="rights">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/rights' }">权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 列表 -->
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="index"></el-table-column>
      <el-table-column prop="authName" label="权限名称"></el-table-column>
      <el-table-column prop="path" label="路径"></el-table-column>
      <el-table-column prop="level" label="层级"></el-table-column>
    </el-table>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: []
    }
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: `rights/list`
      })
      this.userList = res.data
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang = 'less' scoped>
</style>
