<template>
  <div class="users">
    <!-- 添加用户模态框 -->
    <el-dialog title="添加用户" :visible.sync="addVisible" width="40%">
      <el-form :rules="rules" class="addform" ref="addform" :model="addform" label-width="80px">
        <el-form-item prop="username" label="用户名">
          <el-input placeholder="请输入用户名" v-model="addform.username"></el-input>
        </el-form-item>
        <el-form-item prop="password" label="密码">
          <el-input type="password" placeholder="请输入密码" v-model="addform.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="addform.email"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="电话">
          <el-input placeholder="请输入电话号" v-model="addform.tel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addVisible = false">取 消</el-button>
        <el-button type="primary" @click="adduser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑用户模态框 -->
    <el-dialog title="修改用户" :visible.sync="editVisible" width="40%">
      <el-form :rules="rules" class="editform" ref="editform" :model="editform" label-width="80px">
        <el-form-item label="用户名">
          <el-tag type="info">{{ editform.username }}</el-tag>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input placeholder="请输入邮箱" v-model="editform.email"></el-input>
        </el-form-item>
        <el-form-item prop="tel" label="电话">
          <el-input placeholder="请输入电话号" v-model="editform.tel"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUser">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 搜索框 -->
    <div style="margin-top: 15px;">
      <el-input class="search" placeholder="请输入内容" v-model="query" @keyup.enter.native="searchUser">
        <el-button @click="searchUser" slot="append" icon="el-icon-search"></el-button>
      </el-input>
      <el-button @click="showAdd" type="success" plain>添加用户</el-button>
    </div>
    <!-- 列表 -->
    <el-table :data="userlist" style="width: 100%">
      <el-table-column label="姓名" prop="username" width="180"></el-table-column>
      <el-table-column label="邮箱" prop="email" width="180"></el-table-column>
      <el-table-column label="电话" prop="mobile" width="180"></el-table-column>
      <el-table-column label="状态" prop="mg_state" width="180">
        <template slot-scope="scope">
          <el-switch
            @change="changeState(scope.row.id,scope.row.mg_state)"
            v-model="scope.row.mg_state"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button
            @click="editshow(scope.row)"
            type="primary"
            icon="el-icon-edit"
            size="mini"
            plain
            circle
          ></el-button>
          <el-button
            @click="delUser(scope.row.id)"
            type="danger"
            icon="el-icon-delete"
            size="mini"
            plain
            circle
          ></el-button>
          <el-button @click="showRole(scope.row)" type="success" size="mini" plain round>
            <i class="el-icon-check"></i>分配角色
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="block">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="this.pagenum"
        :page-sizes="[2, 4, 6, 8]"
        :page-size="100"
        layout="total, sizes, prev, pager, next, jumper"
        :total="this.total"
        :background="true"
        prev-text="上一页"
        next-text="下一页"
      ></el-pagination>
    </div>
    <!-- 分配角色模态框 -->
    <el-dialog title="分配角色" :visible.sync="setVisible" width="50%">
      <el-form ref="assignForm" :model="assignForm" label-width="80px">
        <el-form-item prop="rolename" label="用户名">
          <el-tag type="info">{{assignForm.userName}}</el-tag>
        </el-form-item>
        <el-form-item prop="rolename" label="角色列表">
          <el-select v-model="assignForm.rid" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setVisible = false">取 消</el-button>
        <el-button @click="setRole" type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      query: '',
      pagenum: 1,
      pagesize: 2,
      userlist: [],
      total: 0,
      addVisible: false,
      editVisible: false,
      setVisible: false,
      addform: {
        username: '',
        password: '',
        email: '',
        tel: ''
      },
      editform: {
        id: '',
        username: '',
        email: '',
        tel: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          { min: 3, max: 9, message: '长度在 3 到 9 个字符', trigger: 'change' }
        ],
        password: [
          { required: true, message: '请输入用户名', trigger: 'change' },
          {
            min: 6,
            max: 12,
            message: '长度在 6 到 12 个字符',
            trigger: 'change'
          }
        ],
        email: [
          { type: 'email', message: '请输入合法的邮箱', trigger: 'blur' }
        ],
        tel: [
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入合法的手机号',
            trigger: 'blur'
          }
        ]
      },
      assignForm: {
        rid: '',
        userName: '',
        id: ''
      },
      roleList: []
    }
  },
  methods: {
    async getList() {
      let res = await this.axios({
        method: 'get',
        url: 'users',
        params: {
          query: this.query,
          pagenum: this.pagenum,
          pagesize: this.pagesize
        },
        headers: {
          Authorization: localStorage.getItem('token')
        }
      })
      if (res.meta.status === 200) {
        // console.log(res.data.users)
        this.userlist = res.data.users
        this.total = res.data.total
      }
    },
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`)
      this.pagesize = val
      this.getList()
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`)
      this.pagenum = val
      this.getList()
    },
    changeState(id, state) {
      // console.log(id, state)
      this.axios({
        method: 'put',
        url: `users/${id}/state/${state}`
      })
    },
    async delUser(id) {
      // console.log(id)
      try {
        await this.$confirm('是否删除用户?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          url: `users/${id}`
        })
        if (res.meta.status === 200) {
          if (this.userlist.length <= 1 && this.pagenum > 1) {
            this.pagenum--
          }
          this.getList()
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        } else {
          this.$message.error('删除失败')
        }
      } catch (error) {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      }
    },
    searchUser() {
      this.pagenum = 1
      this.getList()
      this.query = ''
    },
    showAdd() {
      this.addVisible = true
    },
    adduser() {
      this.$refs['addform'].validate(async valid => {
        if (valid) {
          let res = await this.axios({
            method: 'post',
            url: 'users',
            data: this.addform
          })
          if (res.meta.status === 201) {
            this.$message.success(res.meta.msg)
            this.$refs['addform'].resetFields()
            this.addVisible = false
            this.pagenum = 1
            this.getList()
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('校验失败')
          return false
        }
      })
    },
    editshow(user) {
      this.editVisible = true
      // console.log(user)
      this.editform.username = user.username
      this.editform.email = user.email
      this.editform.tel = user.mobile
      this.editform.id = user.id
    },
    editUser() {
      this.$refs['editform'].validate(async valid => {
        if (valid) {
          let res = await this.axios({
            method: 'put',
            url: `users/${this.editform.id}`,
            data: {
              email: this.editform.email,
              mobile: this.editform.tel
            }
          })
          if (res.meta.status === 200) {
            this.editVisible = false
            this.$message.success('修改成功')
            this.getList()
          } else {
            this.$message.error(res.meta.msg)
          }
        } else {
          this.$message.error('校验失败')
          return false
        }
      })
    },
    async getRid(id) {
      let res = await this.axios({
        method: 'get',
        url: `users/${id}`
      })
      if (res.meta.status === 200) {
        let rid = res.data.rid
        if (rid === -1) {
          rid = ''
        }
        this.assignForm.rid = rid
      }
    },
    async showRole(user) {
      // console.log(user)
      this.assignForm.id = user.id
      this.assignForm.userName = user.username
      this.setVisible = true
      this.getRid(user.id)
      // this.assignForm.rid = user.rid
      let res = await this.axios({
        method: 'get',
        url: `roles`
      })
      if (res.meta.status === 200) {
        // console.log(res)
        this.roleList = res.data
      }
    },
    async setRole() {
      // console.log(this.assignForm.rid)
      let { id, rid } = this.assignForm
      if (!rid) {
        this.$message.error('请选择一个角色')
        return
      }
      let res = await this.axios({
        method: 'put',
        url: `users/${id}/role`,
        data: { rid }
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('设置角色成功')
        this.setVisible = false
      } else {
        this.$message.error('设置角色失败')
      }
    }
  },
  created() {
    this.getList()
  }
}
</script>

<style lang = 'less' scoped>
.el-input.search {
  width: 300px;
  margin-bottom: 10px;
}
.el-form.addform .el-input {
  width: 400px;
}
</style>
