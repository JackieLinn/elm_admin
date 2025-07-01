<template>
  <div class="food-manage-page">
    <h2 class="food-manage-title">菜品管理</h2>
    <el-card>
      <div class="flex items-center mb-4">
        <span class="font-bold text-lg mr-4">菜品管理</span>
        <el-select v-model="selectedBusinessId" placeholder="选择商家" style="width: 200px; margin-right: 12px;" @change="handleBusinessChange">
          <el-option v-for="b in businessList" :key="b.businessId" :label="b.businessName" :value="b.businessId" />
        </el-select>
        <el-select v-model="foodStatus" placeholder="按状态筛选" style="width: 120px; margin-right: 12px;" @change="handleStatusChange">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="keyword" placeholder="菜品名称搜索" style="width: 180px; margin-right: 8px;" clearable @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="foodList" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="foodId" label="菜品ID" width="80" />
        <el-table-column prop="foodName" label="菜品名称" width="140" />
        <el-table-column prop="foodExplain" label="菜品描述" width="180" />
        <el-table-column prop="foodImg" label="图片" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.foodImg" />
          </template>
        </el-table-column>
        <el-table-column prop="foodPrice" label="价格" width="80" />
        <el-table-column prop="businessId" label="商家ID" width="80" />
        <el-table-column prop="remarks" label="备注" width="100" />
        <el-table-column prop="foodStatus" label="状态" width="80">
          <template #default="{ row }">
            <el-tag :type="row.foodStatus === 1 ? 'success' : 'info'">{{ row.foodStatus === 1 ? '上架' : '下架' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isDeleted" label="已删除" width="80">
          <template #default="{ row }">
            <el-tag :type="row.isDeleted === 0 ? 'success' : 'danger'">{{ row.isDeleted === 0 ? '否' : '是' }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createTime" label="创建时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.createTime) }}
          </template>
        </el-table-column>
        <el-table-column prop="updateTime" label="更新时间" width="160">
          <template #default="{ row }">
            {{ formatDateTime(row.updateTime) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="{ row }">
            <el-button
              size="small"
              :type="row.foodStatus === 1 ? 'warning' : 'success'"
              @click="toggleFoodStatus(row)"
            >
              {{ row.foodStatus === 1 ? '下架' : '上架' }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="flex justify-end mt-4">
        <el-pagination
          background
          layout="sizes, prev, pager, next, jumper, ->, total"
          :total="total"
          :page-size="pageSize"
          :page-sizes="pageSizes"
          :current-page="pageNum"
          @current-change="handlePageChange"
          @size-change="handlePageSizeChange"
        />
      </div>
    </el-card>

    <!-- 新增/编辑菜品弹窗 -->
    <el-dialog 
      :title="isEdit ? '编辑菜品' : '新增菜品'" 
      v-model="dialogVisible" 
      width="500px"
      :close-on-click-modal="false"
    >
      <el-form 
        ref="foodFormRef" 
        :model="foodForm" 
        :rules="foodRules" 
        label-width="80px"
        @submit.prevent
      >
        <el-form-item label="菜品名称" prop="foodName">
          <el-input v-model="foodForm.foodName" placeholder="请输入菜品名称" />
        </el-form-item>
        <el-form-item label="菜品价格" prop="foodPrice">
          <el-input-number 
            v-model="foodForm.foodPrice" 
            :precision="2" 
            :step="0.1" 
            :min="0"
            style="width: 100%"
            placeholder="请输入菜品价格"
          />
        </el-form-item>
        <el-form-item label="菜品图片" prop="foodImg">
          <el-input v-model="foodForm.foodImg" placeholder="请输入图片URL地址" />
          <div class="image-preview" v-if="foodForm.foodImg">
            <el-image 
              :src="foodForm.foodImg" 
              style="width: 100px; height: 100px; margin-top: 8px; border-radius: 4px;"
              fit="cover"
            />
          </div>
        </el-form-item>
        <el-form-item label="菜品描述" prop="foodExplain">
          <el-input 
            v-model="foodForm.foodExplain" 
            type="textarea" 
            :rows="3"
            placeholder="请输入菜品描述"
          />
        </el-form-item>
        <el-form-item label="备注" prop="remarks">
          <el-input 
            v-model="foodForm.remarks" 
            type="textarea" 
            :rows="2"
            placeholder="请输入备注信息（可选）"
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitFoodForm" :loading="submitLoading">
            {{ isEdit ? '更新' : '新增' }}
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue';
import { get, post } from '@/net';
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus';

// 商家和菜品数据类型
interface BusinessVO {
  businessId: number;
  businessName: string;
}
interface FoodVO {
  foodId: number;
  foodName: string;
  foodExplain: string;
  foodImg: string;
  foodPrice: number;
  businessId: number;
  remarks: string;
  foodStatus: number;
  isDeleted: number;
  createTime: string;
  updateTime: string;
}

const businessList = ref<BusinessVO[]>([]);
const selectedBusinessId = ref<number|null>(null);
const foodList = ref<FoodVO[]>([]);
const total = ref(0);
const loading = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const pageSizes = [5, 10, 20, 50];
const foodStatus = ref<number|null>(null);
const keyword = ref('');

const statusOptions = [
  { label: '全部', value: null },
  { label: '上架', value: 1 },
  { label: '下架', value: 0 }
];

// 弹窗相关
const dialogVisible = ref(false);
const isEdit = ref(false);
const submitLoading = ref(false);
const foodFormRef = ref<FormInstance>();

// 表单数据
const foodForm = reactive({
  foodId: '',
  foodName: '',
  foodPrice: 0,
  foodImg: '',
  foodExplain: '',
  businessId: '',
  remarks: ''
});

// 表单验证规则
const foodRules: FormRules = {
  foodName: [
    { required: true, message: '请输入菜品名称', trigger: 'blur' },
    { min: 1, max: 50, message: '菜品名称长度在 1 到 50 个字符', trigger: 'blur' }
  ],
  foodPrice: [
    { required: true, message: '请输入菜品价格', trigger: 'blur' },
    { type: 'number', min: 0, message: '价格必须大于等于0', trigger: 'blur' }
  ],
  foodExplain: [
    { max: 200, message: '菜品描述长度不能超过200个字符', trigger: 'blur' }
  ]
};

function fetchBusinessList() {
  get(`/api/business/admin/list?pageNum=1&pageSize=1000`, (data: any) => {
    businessList.value = data.records || [];
    if (businessList.value.length > 0) {
      selectedBusinessId.value = businessList.value[0].businessId;
      fetchFoodList();
    }
  }, () => {
    ElMessage.error('获取商家列表失败');
  });
}

function fetchFoodList() {
  if (!selectedBusinessId.value) {
    foodList.value = [];
    total.value = 0;
    return;
  }
  loading.value = true;
  let url = `/api/food/list-all-food-by-BusinessId?businessId=${selectedBusinessId.value}`;
  get(url, (data: any[]) => {
    let filtered = data;
    if (foodStatus.value !== null) filtered = filtered.filter(f => f.foodStatus === foodStatus.value);
    if (keyword.value) filtered = filtered.filter(f => f.foodName.includes(keyword.value));
    total.value = filtered.length;
    const start = (pageNum.value - 1) * pageSize.value;
    const end = start + pageSize.value;
    foodList.value = filtered.slice(start, end);
    loading.value = false;
  }, () => {
    ElMessage.error('获取菜品列表失败');
    loading.value = false;
  });
}

function handleBusinessChange() {
  pageNum.value = 1;
  fetchFoodList();
}

// 显示新增弹窗
function showAddDialog() {
  isEdit.value = false;
  resetForm();
  foodForm.businessId = selectedBusinessId.value;
  dialogVisible.value = true;
}

// 显示编辑弹窗
function showEditDialog(row: any) {
  isEdit.value = true;
  resetForm();
  Object.assign(foodForm, {
    foodId: row.foodId,
    foodName: row.foodName,
    foodPrice: row.foodPrice,
    foodImg: row.foodImg,
    foodExplain: row.foodExplain,
    businessId: selectedBusinessId.value,
    remarks: row.remarks || ''
  });
  dialogVisible.value = true;
}

// 重置表单
function resetForm() {
  Object.assign(foodForm, {
    foodId: '',
    foodName: '',
    foodPrice: 0,
    foodImg: '',
    foodExplain: '',
    businessId: '',
    remarks: ''
  });
  foodFormRef.value?.clearValidate();
}

// 提交表单
function submitFoodForm() {
  foodFormRef.value?.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      const url = isEdit.value ? '/api/food/update' : '/api/food/add';
      
      post(url, foodForm, () => {
        ElMessage.success(isEdit.value ? '菜品更新成功' : '菜品新增成功');
        dialogVisible.value = false;
        fetchFoodList();
      }, (message: string) => {
        ElMessage.error(message || (isEdit.value ? '菜品更新失败' : '菜品新增失败'));
      });
      
      submitLoading.value = false;
    }
  });
}

// 删除确认
function showDeleteConfirm(row: any) {
  ElMessageBox.confirm(
    `确定要删除菜品"${row.foodName}"吗？删除后无法恢复。`,
    '确认删除',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    }
  ).then(() => {
    deleteFood(row.foodId);
  });
}

// 删除菜品
function deleteFood(foodId: string) {
  post(`/api/food/delete?foodId=${foodId}`, {}, () => {
    ElMessage.success('菜品删除成功');
    fetchFoodList();
  }, (message: string) => {
    ElMessage.error(message || '菜品删除失败');
  });
}

// 切换菜品状态（上架/下架）
function toggleFoodStatus(row: FoodVO) {
  const newStatus = row.foodStatus === 1 ? 0 : 1;
  const actionText = newStatus === 1 ? '上架' : '下架';
  ElMessageBox.confirm(`确定要${actionText}菜品"${row.foodName}"吗？`, `确认${actionText}`, {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  }).then(() => {
    // 管理员端接口
    const url = newStatus === 1
      ? `/api/food/admin/enable?foodId=${row.foodId}`
      : `/api/food/admin/disable?foodId=${row.foodId}`;
    post(url, {}, () => {
      ElMessage.success(`菜品${actionText}成功`);
      fetchFoodList();
    }, (msg: string) => {
      ElMessage.error(msg || `菜品${actionText}失败`);
    });
  });
}

function handleStatusChange(val: number|null) {
  pageNum.value = 1;
  fetchFoodList();
}

function handlePageChange(val: number) {
  pageNum.value = val;
  fetchFoodList();
}

function handlePageSizeChange(val: number) {
  pageSize.value = val;
  pageNum.value = 1;
  fetchFoodList();
}

function handleSearch() {
  pageNum.value = 1;
  fetchFoodList();
}

function formatDateTime(val: string) {
  if (!val) return '-';
  return val.replace('T', ' ').slice(0, 19);
}

onMounted(() => {
  fetchBusinessList();
});
</script>

<style scoped>
.food-manage-page {
  padding: 30px 20px;
}
.food-manage-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 18px;
}
.not-merchant {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
}
.join-card {
  width: 350px;
  text-align: center;
  padding: 40px 0;
}
.join-tip {
  font-size: 18px;
  margin-bottom: 18px;
}
.merchant-content {
  margin-top: 20px;
}
.food-manage-toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
}
.price-text {
  color: #e6a23c;
  font-weight: bold;
}
.image-preview {
  margin-top: 8px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 