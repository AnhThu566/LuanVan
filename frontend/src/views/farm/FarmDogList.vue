<template>
  <div class="card shadow-sm border-0 animate__animated animate__fadeIn">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 text-success font-weight-bold">
        <i class="fas fa-list-ul mr-2"></i> DANH SÁCH THÚ CƯNG CỦA TRẠI
      </h5>
      <router-link to="/farm/add-dog" class="btn btn-success font-weight-bold shadow-sm">
        <i class="fas fa-plus mr-1"></i> Đăng Bán Chó Mới
      </router-link>
    </div>

    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover mb-0 text-center align-middle">
          <thead class="bg-light text-secondary">
            <tr class="text-uppercase" style="font-size: 0.85rem;">
              <th width="50">STT</th>
              <th width="90">Hình ảnh</th>
              <th width="100">Mã chó</th>
              <th class="text-left">Tên bé chó</th>
              <th>Giới tính</th>
              <th>Giá bán (VNĐ)</th>
              <th width="150">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dog, index) in myDogs" :key="dog.id || dog._id">
              <td>{{ index + 1 }}</td>
              <td>
                <img :src="dog.image ? 'http://localhost:3000' + dog.image : 'https://via.placeholder.com/60?text=No+Img'" 
                     class="img-thumbnail rounded-circle object-fit-cover shadow-sm" style="width: 50px; height: 50px;">
              </td>
              <td class="font-weight-bold text-primary">{{ dog.maCho || '---' }}</td>
              <td class="text-left font-weight-bold text-dark">{{ dog.name }}</td>
              <td>{{ dog.gender }}</td>
              <td class="text-danger font-weight-bold">{{ dog.price?.toLocaleString('vi-VN') }}</td>
              <td>
                <span :class="getStatusClass(dog.status)" class="badge px-3 py-2 shadow-sm mb-1">
                  {{ dog.status }}
                </span>
                <div v-if="dog.status === 'Từ chối' && dog.rejectionReason" class="text-danger small font-italic mt-1" style="line-height: 1.2;">
                  Lý do: {{ dog.rejectionReason }}
                </div>
              </td>
            </tr>
            <tr v-if="myDogs.length === 0">
              <td colspan="7" class="py-5 text-center text-muted">
                <i class="fas fa-box-open fa-2x mb-3 opacity-50"></i><br>
                Trại của bạn chưa đăng bán bé chó nào.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import DogService from "@/services/dog.service";
import createApiClient from "@/services/api.service"; 

export default {
  data() {
    return {
      myDogs: [],
      currentUser: null,
      myFarmId: null
    };
  },
  async created() {
    const userData = localStorage.getItem("user");
    if (userData) {
      this.currentUser = JSON.parse(userData);
      await this.fetchMyFarmId(); 
    }
  },
  methods: {
    // 1. Tìm Farm ID dựa trên ID người dùng đang đăng nhập
    async fetchMyFarmId() {
      try {
        const api = createApiClient("/api/farms");
        const response = await api.get("/");
        const farms = response.data;
        const currentUserId = this.currentUser._id || this.currentUser.id;

        const myFarm = farms.find(f => {
          const ownerId = f.ownerId?._id || f.ownerId?.id || f.ownerId;
          return ownerId === currentUserId;
        });
        
        if (myFarm) {
          this.myFarmId = myFarm._id || myFarm.id; 
          this.fetchMyDogs(); 
        }
      } catch (error) {
        console.error("Lỗi tìm trại:", error);
      }
    },
    // 2. Lấy danh sách chó và lọc ra những bé thuộc trại này
    async fetchMyDogs() {
      try {
        const allDogs = await DogService.getAll();
        this.myDogs = allDogs.filter(dog => {
          const dogFarmId = dog.farmId?._id || dog.farmId?.id || dog.farmId;
          return dogFarmId === this.myFarmId;
        });
      } catch (error) {
        console.error("Lỗi lấy danh sách chó:", error);
      }
    },
    getStatusClass(status) {
      if (status === 'Chờ duyệt') return 'badge-warning text-dark';
      if (status === 'Đã duyệt') return 'badge-success';
      if (status === 'Từ chối') return 'badge-danger';
      return 'badge-secondary';
    }
  }
};
</script>
<style scoped> .object-fit-cover { object-fit: cover; } </style>