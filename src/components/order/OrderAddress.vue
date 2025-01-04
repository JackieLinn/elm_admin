<script setup lang="ts">
import { ref, onMounted, defineProps, defineEmits } from 'vue';
import axios from 'axios';

// 定义 props
const props = defineProps<{
  userId: number;
}>();

// 定义 emits
const emit = defineEmits<{
  (e: 'update-daId', daId: number | null): void;
}>();

const token = JSON.parse(sessionStorage.getItem('access_token')).token;

// 定义接口
interface DeliveryAddressVO {
  daId: number;
  contactName: string;
  contactSex: number; // 1: 男, 0: 女
  contactTel: string;
  address: string;
}

interface DeliveryAddressSaveRO {
  contactName: string;
  contactSex: number;
  contactTel: string;
  address: string;
  userId: number;
}

interface DeliveryAddressUpdateRO {
  daId: number;
  contactName: string;
  contactSex: number;
  contactTel: string;
  address: string;
  userId: number;
}

// 状态变量
const addresses = ref<DeliveryAddressVO[]>([]);
const selectedAddress = ref<DeliveryAddressVO | null>(null);
const dialogVisible = ref(false);
const addEditDialogVisible = ref(false);
const isEditing = ref(false);
const currentEditAddress = ref<DeliveryAddressVO | null>(null);

// 新增/编辑表单
const form = ref<{
  daId?: number;
  contactName: string;
  contactSex: number;
  contactTel: string;
  address: string;
}>({
  contactName: '',
  contactSex: 1,
  contactTel: '',
  address: '',
});

// 获取所有地址
const fetchAddresses = async () => {
  try {
    const response = await axios.get<DeliveryAddressVO[]>('/api/deliveryAddress/get-all-address', {
      params: {
        userId: props.userId
      }, headers: {
        Authorization: `Bearer ${token}`
      }
    });
    addresses.value = response.data;
    if (addresses.value.length > 0) {
      selectedAddress.value = addresses.value[0];
      emit('update-daId', selectedAddress.value.daId);
    } else {
      selectedAddress.value = null;
      emit('update-daId', null);
    }
  } catch (error) {
    console.error('获取地址列表失败:', error);
  }
};

// 打开地址列表对话框
const openDialog = () => {
  dialogVisible.value = true;
};

// 关闭地址列表对话框
const closeDialog = () => {
  dialogVisible.value = false;
};

// 选择地址
const selectAddress = (address: DeliveryAddressVO) => {
  selectedAddress.value = address;
  emit('update-daId', address.daId);
  closeDialog();
};

// 打开新增地址对话框
const openAddDialog = () => {
  isEditing.value = false;
  form.value = {
    contactName: '',
    contactSex: 1,
    contactTel: '',
    address: '',
  };
  addEditDialogVisible.value = true;
};

// 打开编辑地址对话框
const openEditDialog = (address: DeliveryAddressVO) => {
  isEditing.value = true;
  currentEditAddress.value = address;
  form.value = {
    daId: address.daId,
    contactName: address.contactName,
    contactSex: address.contactSex,
    contactTel: address.contactTel,
    address: address.address,
  };
  addEditDialogVisible.value = true;
};

// 删除地址
const deleteAddress = async (daId: number) => {
  try {
    await axios.post('/api/deliveryAddress/remove-address', null, {
      params: {
        daId
      }, headers: {
        Authorization: `Bearer ${token}`
      }
    });
    await fetchAddresses();
    // 如果删除的是当前选中的地址，重置选中
    if (selectedAddress.value?.daId === daId) {
      if (addresses.value.length > 0) {
        selectedAddress.value = addresses.value[0];
        emit('update-daId', selectedAddress.value.daId);
      } else {
        selectedAddress.value = null;
        emit('update-daId', null);
      }
    }
  } catch (error) {
    console.error('删除地址失败:', error);
  }
};

// 提交新增/编辑表单
const submitForm = async () => {
  if (!form.value.contactName || !form.value.contactTel || !form.value.address) {
    alert('请填写完整的地址信息');
    return;
  }

  if (isEditing.value && form.value.daId !== undefined) {
    // 编辑地址
    const updateRO: DeliveryAddressUpdateRO = {
      daId: form.value.daId,
      contactName: form.value.contactName,
      contactSex: form.value.contactSex,
      contactTel: form.value.contactTel,
      address: form.value.address,
      userId: props.userId,
    };
    try {
      await axios.post('/api/deliveryAddress/update-address', updateRO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchAddresses();
      addEditDialogVisible.value = false;
    } catch (error) {
      console.error('更新地址失败:', error);
    }
  } else {
    // 新增地址
    const saveRO: DeliveryAddressSaveRO = {
      contactName: form.value.contactName,
      contactSex: form.value.contactSex,
      contactTel: form.value.contactTel,
      address: form.value.address,
      userId: props.userId,
    };
    try {
      await axios.post('/api/deliveryAddress/save-address', saveRO, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      await fetchAddresses();
      addEditDialogVisible.value = false;
    } catch (error) {
      console.error('保存地址失败:', error);
    }
  }
};

// 关闭新增/编辑对话框
const closeAddEditDialog = () => {
  addEditDialogVisible.value = false;
};

// 处理删除操作的确认
const confirmDelete = (daId: number) => {
  if (confirm('确定删除该地址吗？')) {
    deleteAddress(daId);
  }
};

// 在组件挂载时获取地址列表
onMounted(() => {
  fetchAddresses();
});
</script>

<template>
  <div class="w-full mt-[12vw] bg-[#0097FF] p-[2vw] text-white">
    <h5 class="text-[3.5vw] font-light m-0">订单配送至：</h5>

    <div
        class="w-full flex justify-between items-center font-bold cursor-pointer user-select-none my-[1vw]"
        @click="openDialog"
    >
      <span class="w-[90%] text-[5vw]">
        {{
          selectedAddress
              ? `${selectedAddress.contactName}${selectedAddress.contactSex === 1 ? '先生' : '女士'} ${selectedAddress.contactTel} ${selectedAddress.address}`
              : '暂无信息，请先添加地址'
        }}
      </span>
      <i-material-symbols-chevron-right class="text-[5vw] font-bold"/>
    </div>
  </div>

  <!-- 地址列表对话框 -->
  <div v-if="dialogVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white w-11/12 max-w-lg p-4 rounded shadow-lg relative">
      <h3 class="text-xl font-semibold mb-4">选择配送地址</h3>
      <div v-if="addresses.length > 0" class="max-h-80 overflow-y-auto">
        <div
            v-for="address in addresses"
            :key="address.daId"
            class="flex justify-between items-center p-2 border-b cursor-pointer hover:bg-gray-100"
            @click="selectAddress(address)"
        >
          <div>
            <div class="font-bold">
              {{ address.contactName }}{{ address.contactSex === 1 ? '先生' : '女士' }} {{ address.contactTel }}
            </div>
            <div class="text-sm">{{ address.address }}</div>
          </div>
          <div class="flex space-x-2">
            <button
                class="text-blue-500 text-sm"
                @click.stop="openEditDialog(address)"
            >
              修改
            </button>
            <button
                class="text-red-500 text-sm"
                @click.stop="confirmDelete(address.daId)"
            >
              删除
            </button>
          </div>
        </div>
      </div>
      <div v-else class="text-center text-gray-500">暂无信息，请先添加地址</div>
      <button
          class="mt-4 w-full bg-blue-500 text-white py-2 rounded"
          @click="openAddDialog"
      >
        新增地址
      </button>
      <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          @click="closeDialog"
      >
        ×
      </button>
    </div>
  </div>

  <!-- 新增/编辑地址对话框 -->
  <div v-if="addEditDialogVisible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white w-11/12 max-w-md p-4 rounded shadow-lg relative">
      <h3 class="text-xl font-semibold mb-4">{{ isEditing ? '编辑地址' : '新增地址' }}</h3>
      <form @submit.prevent="submitForm" class="space-y-4">
        <div>
          <label class="block mb-1">联系人姓名</label>
          <input
              type="text"
              v-model="form.contactName"
              class="w-full border px-2 py-1 rounded"
              required
          />
        </div>
        <div>
          <label class="block mb-1">联系人性别</label>
          <select v-model.number="form.contactSex" class="w-full border px-2 py-1 rounded" required>
            <option :value="1">先生</option>
            <option :value="0">女士</option>
          </select>
        </div>
        <div>
          <label class="block mb-1">联系电话</label>
          <input
              type="tel"
              v-model="form.contactTel"
              class="w-full border px-2 py-1 rounded"
              required
          />
        </div>
        <div>
          <label class="block mb-1">详细地址</label>
          <textarea
              v-model="form.address"
              class="w-full border px-2 py-1 rounded"
              required
          ></textarea>
        </div>
        <div class="flex justify-end space-x-2">
          <button type="button" class="px-4 py-2" @click="closeAddEditDialog">取消</button>
          <button type="submit" class="bg-blue-500 text-white px-4 py-2 rounded">
            {{ isEditing ? '保存修改' : '新增地址' }}
          </button>
        </div>
      </form>
      <button
          class="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          @click="closeAddEditDialog"
      >
        ×
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>