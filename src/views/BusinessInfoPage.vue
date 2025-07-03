<template>
  <div class="business-manage-page">
    <el-card>
      <div class="flex items-center mb-4">
        <span class="font-bold text-lg mr-4">商家管理</span>
        <el-select v-model="status" placeholder="按状态筛选" style="width: 140px; margin-right: 16px;" @change="handleStatusChange">
          <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
        <el-input v-model="keyword" placeholder="商家名称搜索" style="width: 220px; margin-right: 8px;" clearable @keyup.enter="handleSearch" />
        <el-button type="primary" @click="handleSearch">搜索</el-button>
      </div>
      <el-table :data="businessList" v-loading="loading" border stripe style="width: 100%">
        <el-table-column prop="businessId" label="商家ID" width="100" />
        <el-table-column prop="businessName" label="商家名称" width="160" />
        <el-table-column prop="businessAddress" label="商家地址" width="180" />
        <el-table-column prop="businessExplain" label="商家简介" width="200" />
        <el-table-column prop="businessImg" label="商家图片" width="100">
          <template #default="{ row }">
            <el-avatar :src="row.businessImg" />
          </template>
        </el-table-column>
        <el-table-column prop="orderTypeId" label="类型ID" width="100" />
        <el-table-column prop="startPrice" label="起送价" width="100" />
        <el-table-column prop="deliveryPrice" label="配送费" width="100" />
        <el-table-column prop="remarks" label="备注" width="120" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'danger'">{{ row.status === 1 ? '正常' : '禁用' }}</el-tag>
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
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { get } from '@/net';
import { ElMessage } from 'element-plus';

// 商家数据类型
interface BusinessVO {
  businessId: number;
  businessName: string;
  businessAddress: string;
  businessExplain: string;
  businessImg: string;
  orderTypeId: number;
  startPrice: number;
  deliveryPrice: number;
  remarks: string;
  status: number;
}

const businessList = ref<BusinessVO[]>([]);
const total = ref(0);
const loading = ref(false);
const pageNum = ref(1);
const pageSize = ref(10);
const pageSizes = [5, 10, 20, 50];
const status = ref<number|null>(null);
const keyword = ref('');

const statusOptions = [
  { label: '全部', value: null },
  { label: '正常', value: 1 },
  { label: '禁用', value: 0 }
];

function fetchBusinessList() {
  loading.value = true;
  let url = `/api/business/admin/list?pageNum=${pageNum.value}&pageSize=${pageSize.value}`;
  if (status.value !== null) url += `&status=${status.value}`;
  if (keyword.value) url += `&keyword=${encodeURIComponent(keyword.value)}`;
  get(url, (data: any) => {
    businessList.value = data.records || [];
    total.value = data.total || data.records?.length || 0;
    loading.value = false;
  }, () => {
    ElMessage.error('获取商家列表失败');
    loading.value = false;
  });
}

function handleStatusChange(val: number|null) {
  pageNum.value = 1;
  fetchBusinessList();
}

function handlePageChange(val: number) {
  pageNum.value = val;
  fetchBusinessList();
}

function handlePageSizeChange(val: number) {
  pageSize.value = val;
  pageNum.value = 1;
  fetchBusinessList();
}

function handleSearch() {
  pageNum.value = 1;
  fetchBusinessList();
}

onMounted(() => {
  fetchBusinessList();
});
</script>

<style scoped>
.business-manage-page {
  padding: 24px;
}
</style> 