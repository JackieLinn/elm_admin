<template>
  <div class="dashboard-page">
    <h2 class="dashboard-title">平台数据总览</h2>
    <el-row :gutter="24" class="dashboard-cards">
      <el-col :span="6">
        <el-card class="card-stat">
          <div class="stat-title">用户总数</div>
          <div class="stat-value">{{ userTotal }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-stat">
          <div class="stat-title">商家总数</div>
          <div class="stat-value">{{ businessTotal }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-stat">
          <div class="stat-title">订单总数</div>
          <div class="stat-value">{{ orderTotal }}</div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card class="card-stat">
          <div class="stat-title">待审核入驻</div>
          <div class="stat-value">{{ applyPending }}</div>
        </el-card>
      </el-col>
    </el-row>
    <el-card class="mt-6">
      <div class="chart-title">近7天订单量趋势</div>
      <el-table :data="orderTrend" style="width: 100%">
        <el-table-column prop="date" label="日期" width="120" />
        <el-table-column prop="count" label="订单量" width="100" />
        <el-table-column label="趋势">
          <template #default="{ row }">
            <div class="trend-bar" :style="{ width: (row.count * 12 + 10) + 'px' }"></div>
            <span style="margin-left:8px; color:#888;">{{ row.count }}</span>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import { get } from '@/net';

const userTotal = ref(0);
const businessTotal = ref(0);
const orderTotal = ref(0);
const applyPending = ref(0);
const orderTrend = ref<{ date: string, count: number }[]>([]);

function fetchStats() {
  // 用户总数
  get('/api/account/admin/list?pageNum=1&pageSize=1', (data: any) => {
    userTotal.value = data.total || data.records.length || 0;
  });
  // 商家总数
  get('/api/business/admin/list?pageNum=1&pageSize=1', (data: any) => {
    businessTotal.value = data.total || data.records.length || 0;
  });
  // 订单总数和趋势
  get('/api/orders/admin/list-by-business?businessId=0&pageNum=1&pageSize=10000', (data: any) => {
    orderTotal.value = data.total || data.records.length || 0;
    // 统计近7天订单量
    const today = new Date();
    const days: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      days.push(`${d.getFullYear()}-${(d.getMonth()+1).toString().padStart(2,'0')}-${d.getDate().toString().padStart(2,'0')}`);
    }
    const trend = days.map(date => ({ date, count: 0 }));
    (data.records || []).forEach((o: any) => {
      const d = o.orderDate?.slice(0, 10);
      const idx = days.indexOf(d);
      if (idx >= 0) trend[idx].count++;
    });
    orderTrend.value = trend;
  });
  // 待审核入驻
  get('/api/business/admin/apply/list?pageNum=1&pageSize=1&status=0', (data: any) => {
    applyPending.value = data.total || data.records.length || 0;
  });
}

onMounted(() => {
  fetchStats();
});
</script>

<style scoped>
.dashboard-page {
  padding: 30px 20px;
}
.dashboard-title {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 18px;
}
.dashboard-cards {
  margin-bottom: 24px;
}
.card-stat {
  text-align: center;
  padding: 24px 0;
}
.stat-title {
  font-size: 16px;
  color: #888;
  margin-bottom: 8px;
}
.stat-value {
  font-size: 32px;
  font-weight: bold;
  color: #409EFF;
}
.chart-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 12px;
}
.mt-6 {
  margin-top: 32px;
}
.trend-bar {
  display: inline-block;
  height: 16px;
  background: #409EFF;
  border-radius: 4px;
  vertical-align: middle;
  transition: width 0.3s;
}
</style>