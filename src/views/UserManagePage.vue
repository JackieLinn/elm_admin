<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue';
import { get, post } from '@/net';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';

// 用户数据类型
interface UserVO {
  userId: number;
  userName: string;
  userSex: number;
  email: string;
  userImg: string;
}

const userList = ref<UserVO[]>([]);
const total = ref(0);
const loading = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const roleId = ref<number|null>(null);

const roleOptions = [
  { label: '全部', value: null },
  { label: '管理员', value: 1 },
  { label: '商家用户', value: 2 },
  { label: '普通用户', value: 3 },
];

function fetchUserList() {
  loading.value = true;
  let url = `/api/account/admin/list?pageNum=${pageNum.value}&pageSize=${pageSize.value}`;
  if (roleId.value) url += `&roleId=${roleId.value}`;
  get(url, (data: any) => {
    userList.value = data.records;
    total.value = data.total && data.total > 0 ? data.total : data.records.length;
    loading.value = false;
  }, () => {
    ElMessage.error('获取用户列表失败');
    loading.value = false;
  });
}

function handleRoleChange(val: number|null) {
  pageNum.value = 1;
  fetchUserList();
}

function handlePageChange(val: number) {
  pageNum.value = val;
  fetchUserList();
}

// 新增/编辑弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const userFormRef = ref<FormInstance>();
const userForm = reactive({
  userId: '',
  userName: '',
  password: '',
  userSex: 1,
  email: '',
  userImg: ''
});
const userRules: FormRules = {
  userName: [ { required: true, message: '请输入用户名', trigger: 'blur' } ],
  password: [ { required: true, message: '请输入密码', trigger: 'blur' } ],
  email: [ { required: true, message: '请输入邮箱', trigger: 'blur' }, { type: 'email', message: '邮箱格式不正确', trigger: 'blur' } ],
  userSex: [ { required: true, message: '请选择性别', trigger: 'change' } ]
};

function showAddDialog() {
  isEdit.value = false;
  Object.assign(userForm, { userId: '', userName: '', password: '', userSex: 1, email: '', userImg: '' });
  dialogVisible.value = true;
}
function showEditDialog(row: any) {
  isEdit.value = true;
  Object.assign(userForm, { ...row, password: '' });
  dialogVisible.value = true;
}
function submitUserForm() {
  userFormRef.value?.validate((valid) => {
    if (valid) {
      const url = isEdit.value ? '/api/account/admin/update' : '/api/account/admin/add';
      const data = { ...userForm };
      if (isEdit.value) delete data.password; // 编辑时不传密码
      post(url, data, () => {
        ElMessage.success(isEdit.value ? '用户信息更新成功' : '用户新增成功');
        dialogVisible.value = false;
        fetchUserList();
      }, (msg: string) => {
        ElMessage.error(msg || (isEdit.value ? '用户信息更新失败' : '用户新增失败'));
      });
    }
  });
}

// 删除用户
function deleteUser(row: any) {
  ElMessageBox.confirm(`确定要删除用户“${row.userName}”吗？`, '确认删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    post(`/api/account/admin/delete?userId=${row.userId}`, {}, () => {
      ElMessage.success('用户删除成功');
      fetchUserList();
    }, (msg: string) => {
      ElMessage.error(msg || '用户删除失败');
    });
  });
}

onMounted(() => {
  fetchUserList();
});
</script>

<template>
  <div class="user-manage-page">
    <el-card>
      <div class="flex items-center mb-4">
        <span class="font-bold text-lg mr-4">用户管理</span>
        <el-select v-model="roleId" placeholder="按角色筛选" style="width: 180px" @change="handleRoleChange">
          <el-option v-for="item in roleOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-button type="primary" style="margin-left: auto;" @click="showAddDialog">新增用户</el-button>
      </div>
      <el-table :data="userList" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="userId" label="用户ID" width="100" />
        <el-table-column prop="userName" label="用户名" width="160" />
        <el-table-column prop="email" label="邮箱" width="220" />
        <el-table-column prop="userSex" label="性别" width="80">
          <template #default="{ row }">
            <span>{{ row.userSex === 1 ? '男' : '女' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="userImg" label="头像" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.userImg" />
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180" align="center">
          <template #default="{ row }">
            <el-button size="small" type="primary" @click="showEditDialog(row)">编辑</el-button>
            <el-button size="small" type="danger" @click="deleteUser(row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="prev, pager, next, jumper, ->, total"
          :total="total"
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
    <!-- 新增/编辑用户弹窗 -->
    <el-dialog :title="isEdit ? '编辑用户' : '新增用户'" v-model="dialogVisible" width="400px" :close-on-click-modal="false">
      <el-form ref="userFormRef" :model="userForm" :rules="userRules" label-width="80px" @submit.prevent>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="userForm.userName" placeholder="请输入用户名" />
        </el-form-item>
        <el-form-item v-if="!isEdit" label="密码" prop="password">
          <el-input v-model="userForm.password" type="password" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" />
        </el-form-item>
        <el-form-item label="性别" prop="userSex">
          <el-radio-group v-model="userForm.userSex">
            <el-radio :label="1">男</el-radio>
            <el-radio :label="2">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像" prop="userImg">
          <el-input v-model="userForm.userImg" placeholder="请输入头像URL（可选）" />
          <div v-if="userForm.userImg" style="margin-top: 8px;">
            <el-avatar :src="userForm.userImg" />
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitUserForm">{{ isEdit ? '保存' : '新增' }}</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<style scoped>
.user-manage-page {
  padding: 24px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style>
