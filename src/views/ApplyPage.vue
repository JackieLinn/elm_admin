<template>
  <div class="apply-manage-page">
    <h2 class="apply-manage-title">入驻申请审核</h2>
    <div class="apply-manage-toolbar">
      <el-select v-model="status" placeholder="按状态筛选" style="width: 140px; margin-right: 12px;" @change="handleStatusChange">
        <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <el-input v-model="keyword" placeholder="商家名称搜索" style="width: 200px; margin-right: 8px;" clearable @keyup.enter="handleSearch" />
      <el-button type="primary" @click="handleSearch">搜索</el-button>
    </div>
    <el-table :data="applyList" v-loading="loading" border stripe style="width: 100%; margin-top: 16px;">
      <el-table-column prop="businessName" label="商家名称" min-width="140" align="center" />
      <el-table-column prop="applicantId" label="申请人ID" min-width="100" align="center" />
      <el-table-column prop="applyTime" label="申请时间" min-width="160" align="center">
        <template #default="{ row }">
          {{ formatDateTime(row.applyTime) }}
        </template>
      </el-table-column>
      <el-table-column prop="applyStatus" label="状态" min-width="100" align="center">
        <template #default="{ row }">
          <el-tag :type="getStatusType(row.applyStatus)">{{ getStatusText(row.applyStatus) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="reviewReason" label="审核意见" min-width="160" align="center" />
      <el-table-column label="操作" min-width="120" align="center">
        <template #default="{ row }">
          <el-button v-if="row.applyStatus === 0" type="primary" size="small" @click="openReviewDialog(row)">审核</el-button>
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
    <!-- 审核弹窗 -->
    <el-dialog v-model="dialogVisible" title="审核入驻申请" width="400px">
      <el-form :model="reviewForm" :rules="reviewRules" ref="reviewFormRef" label-width="80px">
        <el-form-item label="审核结果" prop="result">
          <el-radio-group v-model="reviewForm.result">
            <el-radio :label="1">通过</el-radio>
            <el-radio :label="2">驳回</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="审核意见" prop="reviewReason">
          <el-input v-model="reviewForm.reviewReason" type="textarea" :rows="3" placeholder="请输入审核意见" />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="submitReview" :loading="submitLoading">提交</el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get, post } from '@/net';
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';

const applyList = ref<any[]>([]);
const loading = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const total = ref(0);
const pageSizes = [5, 10, 20, 50];
const status = ref<number|null>(null);
const keyword = ref('');

const statusOptions = [
  { label: '全部', value: null },
  { label: '审核中', value: 0 },
  { label: '已通过', value: 1 },
  { label: '被拒绝', value: 2 }
];

function getStatusText(status: number) {
  switch (status) {
    case 0: return '审核中';
    case 1: return '已通过';
    case 2: return '被拒绝';
    default: return '未知';
  }
}
function getStatusType(status: number) {
  switch (status) {
    case 0: return 'warning';
    case 1: return 'success';
    case 2: return 'danger';
    default: return 'info';
  }
}
function formatDateTime(str: string) {
  if (!str) return '';
  return str.replace('T', ' ');
}

function fetchApplyList() {
  loading.value = true;
  let url = `/api/business/admin/apply/list?pageNum=${pageNum.value}&pageSize=${pageSize.value}`;
  if (status.value !== null) url += `&status=${status.value}`;
  if (keyword.value) url += `&keyword=${encodeURIComponent(keyword.value)}`;
  get(url, (data: any) => {
    // 先将未审核的排在前面
    const records = (data.records || []).slice().sort((a, b) => {
      if (a.applyStatus === b.applyStatus) return 0;
      if (a.applyStatus === 0) return -1;
      if (b.applyStatus === 0) return 1;
      return 0;
    });
    applyList.value = records;
    total.value = data.total || 0;
    loading.value = false;
  }, () => {
    ElMessage.error('获取申请列表失败');
    loading.value = false;
  });
}

function handleStatusChange() {
  pageNum.value = 1;
  fetchApplyList();
}
function handleSearch() {
  pageNum.value = 1;
  fetchApplyList();
}
function handlePageChange(val: number) {
  pageNum.value = val;
  fetchApplyList();
}
function handlePageSizeChange(val: number) {
  pageSize.value = val;
  pageNum.value = 1;
  fetchApplyList();
}

// 审核弹窗相关
const dialogVisible = ref(false);
const reviewFormRef = ref<FormInstance>();
const reviewForm = ref({
  applyId: '',
  result: 1,
  reviewReason: ''
});
const reviewRules: FormRules = {
  result: [ { required: true, message: '请选择审核结果', trigger: 'change' } ],
  reviewReason: [ { required: true, message: '请输入审核意见', trigger: 'blur' } ]
};
const submitLoading = ref(false);

function openReviewDialog(row: any) {
  reviewForm.value.applyId = row.applyId;
  reviewForm.value.result = 1;
  reviewForm.value.reviewReason = '';
  dialogVisible.value = true;
}
function submitReview() {
  reviewFormRef.value?.validate((valid) => {
    if (valid) {
      submitLoading.value = true;
      post(`/api/business/admin/apply/review?applyId=${reviewForm.value.applyId}&result=${reviewForm.value.result}&reviewReason=${encodeURIComponent(reviewForm.value.reviewReason)}`, {}, () => {
        ElMessage.success('审核成功');
        dialogVisible.value = false;
        fetchApplyList();
        submitLoading.value = false;
      }, (msg: string) => {
        ElMessage.error(msg || '审核失败');
        submitLoading.value = false;
      });
    }
  });
}

onMounted(() => {
  fetchApplyList();
});
</script>

<style scoped>
.apply-manage-page {
  padding: 30px 20px;
}
.apply-manage-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 18px;
}
.apply-manage-toolbar {
  display: flex;
  gap: 16px;
  align-items: center;
  margin-bottom: 8px;
}
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}
</style> 