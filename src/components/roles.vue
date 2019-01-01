<template>
  <div class="roles">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/roles' }">角色管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-button type="success" @click="showAdd" plain>添加角色</el-button>
    <el-table :data="userList" style="width: 100%">
      <el-table-column type="expand">
        <template slot-scope="{row}">
          <span v-if="!row.children.length">暂无数据</span>
          <el-row class="v1" v-for="v1 in row.children" :key="v1.id">
            <el-col :span="6">
              <el-tag @close="delRight(row,v1.id)" closable>{{v1.authName}}</el-tag>
            </el-col>
            <el-col :span="18">
              <el-row v-for="v2 in v1.children" :key="v2.id">
                <el-col :span="6">
                  <el-tag @close="delRight(row,v2.id)" closable type="success">{{v2.authName}}</el-tag>
                </el-col>
                <el-col :span="18">
                  <el-tag
                    @close="delRight(row,v3.id)"
                    class="v3"
                    v-for="v3 in v2.children"
                    :key="v3.id"
                    closable
                    type="danger"
                  >{{v3.authName}}</el-tag>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </template>
      </el-table-column>
      <el-table-column type="index"></el-table-column>
      <el-table-column label="角色名称" prop="roleName"></el-table-column>
      <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
      <el-table-column label="操作">
        <template slot-scope="{row}">
          <el-button plain type="primary" @click="showEdit(row)" icon="el-icon-edit" circle></el-button>
          <el-button plain type="danger" @click="delRole(row.id)" icon="el-icon-delete" circle></el-button>
          <el-button plain @click="showAssign(row)" type="success" icon="el-icon-check" round>分配权限</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分配权限模态框 -->
    <el-dialog title="分配权限" :visible.sync="assignVisible" width="30%">
      <el-tree
        ref="tree"
        default-expand-all
        :data="userTree"
        show-checkbox
        node-key="id"
        :props="defaultProps"
      ></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="assignVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRight">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加模态框 -->
    <el-dialog title="添加角色" :visible.sync="addVisible" width="50%">
      <el-form :rules="rules" ref="addform" status-icon :model="addform" label-width="80px">
        <el-form-item prop="rolename" label="角色名称">
          <el-input v-model="addform.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="addform.roledec"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelAdd">取 消</el-button>
        <el-button type="primary" @click="addRole(addform)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑模态框 -->
    <el-dialog title="添加角色" :visible.sync="editVisible" width="50%">
      <el-form :rules="rules" ref="editform" status-icon :model="editform" label-width="80px">
        <el-form-item prop="rolename" label="角色名称">
          <el-input v-model="editform.rolename"></el-input>
        </el-form-item>
        <el-form-item label="角色描述">
          <el-input v-model="editform.roledec"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancelEdit">取 消</el-button>
        <el-button type="primary" @click="editRole(editform)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      userList: [],
      userTree: [],
      uid: '',
      assignVisible: false,
      addVisible: false,
      editVisible: false,
      defaultProps: {
        children: 'children',
        label: 'authName'
      },
      addform: {
        rolename: '',
        roledec: ''
      },
      rules: {
        rolename: [
          {
            required: true,
            message: '请输角色名称',
            trigger: 'blur'
          }
        ]
      },
      editform: {
        id: '',
        rolename: '',
        roledec: ''
      }
    }
  },
  methods: {
    async getUserList() {
      let res = await this.axios({
        method: 'get',
        url: 'roles'
      })
      // console.log(res)
      this.userList = res.data
    },
    // 删除权限
    async delRight(role, id) {
      // console.log(role.id, id)
      let res = await this.axios({
        method: 'delete',
        url: `roles/${role.id}/rights/${id}`
      })
      // console.log(res.meta.status)
      if (res.meta.status === 200) {
        role.children = res.data
        this.$message.success('删除成功')
      }
    },
    // 显示树状列表，分配权限
    async showAssign(role) {
      this.assignVisible = true
      let res = await this.axios({
        method: 'get',
        url: 'rights/tree'
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.userTree = res.data
      }
      this.uid = role.id
      let ids = []
      // console.log(role)
      role.children.forEach(v1 => {
        v1.children.forEach(v2 => {
          v2.children.forEach(v3 => {
            ids.push(v3.id)
          })
        })
      })
      // console.log(ids)
      this.$refs.tree.setCheckedKeys(ids)
    },
    async editRight() {
      let id1 = this.$refs.tree.getCheckedKeys()
      let id2 = this.$refs.tree.getHalfCheckedKeys()
      let rids = id1.concat(id2).join()
      // console.log(rids, this.uid)
      let res = await this.axios({
        method: 'post',
        url: `roles/${this.uid}/rights`,
        data: { rids }
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('修改成功')
        this.assignVisible = false
        this.getUserList()
      }
    },
    async delRole(id) {
      try {
        await this.$confirm('您确定要删除这个角色吗吗?', '温馨提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        })
        let res = await this.axios({
          method: 'delete',
          url: `roles/${id}`
        })
        if (res.meta.status === 200) {
          this.$message.success('删除成功')
          this.getUserList()
        }
      } catch (error) {
        this.$message.error('取消删除')
      }
    },
    showAdd() {
      this.addVisible = true
    },
    cancelAdd() {
      this.addVisible = false
      this.addform.rolename = ''
      this.addform.roledec = ''
    },
    async addRole(addform) {
      console.log(addform)
      let res = await this.axios({
        method: 'post',
        url: 'roles',
        data: { roleName: addform.rolename, roleDesc: addform.roledec }
      })
      if (res.meta.status === 201) {
        this.$message.success('添加成功')
        this.getUserList()
        this.addVisible = false
      }
    },
    showEdit(row) {
      this.editVisible = true
      // console.log(row)
      this.editform.rolename = row.roleName
      this.editform.roledec = row.roleDesc
      this.editform.id = row.id
    },
    cancelEdit() {
      this.editVisible = false
      this.editform.rolename = ''
      this.editform.roledec = ''
    },
    async editRole(editform) {
      let res = await this.axios({
        method: 'put',
        url: `roles/${this.editform.id}`,
        data: {
          roleName: editform.rolename,
          roleDesc: editform.roledec
        }
      })
      // console.log(res)
      if (res.meta.status === 200) {
        this.$message.success('修改成功')
        this.getUserList()
        this.editVisible = false
      }
    }
  },
  created() {
    this.getUserList()
  }
}
</script>

<style lang = 'less' scoped>
.v1 {
  padding: 5px;
}
.v3 {
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
