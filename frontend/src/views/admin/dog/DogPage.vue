<template>
  <div class="card shadow-sm border-0 animate__animated animate__fadeIn">
    <div class="card-header bg-white py-3 d-flex justify-content-between align-items-center">
      <h5 class="mb-0 text-primary font-weight-bold">
        <i class="fas fa-paw mr-2"></i> QUẢN LÝ & PHÊ DUYỆT THÚ CƯNG
      </h5>
    </div>

    <div class="card-body p-4">
      <div class="row mb-4">
        <div class="col-md-5">
          <div class="input-group shadow-sm">
            <input type="text" class="form-control border-right-0" placeholder="Tìm kiếm tên chó..." v-model="searchText">
            <div class="input-group-append">
              <button class="btn btn-primary px-3" type="button"><i class="fas fa-search"></i></button>
            </div>
          </div>
        </div>
        <div class="col-md-7 text-right">
          <div class="btn-group shadow-sm">
            <button class="btn font-weight-bold" :class="filterStatus === 'Tất cả' ? 'btn-secondary' : 'btn-outline-secondary'" @click="filterStatus = 'Tất cả'">Tất cả</button>
            <button class="btn font-weight-bold" :class="filterStatus === 'Chờ duyệt' ? 'btn-warning text-dark' : 'btn-outline-warning text-dark'" @click="filterStatus = 'Chờ duyệt'">Chờ duyệt</button>
            <button class="btn font-weight-bold" :class="filterStatus === 'Đã duyệt' ? 'btn-success' : 'btn-outline-success'" @click="filterStatus = 'Đã duyệt'">Đã duyệt</button>
            <button class="btn font-weight-bold" :class="filterStatus === 'Từ chối' ? 'btn-danger' : 'btn-outline-danger'" @click="filterStatus = 'Từ chối'">Từ chối</button>
          </div>
        </div>
      </div>

      <div class="table-responsive mt-3">
        <table class="table table-bordered table-hover mb-0">
          <thead class="bg-light text-center text-secondary">
            <tr class="text-uppercase font-weight-bold" style="font-size: 0.85rem;">
              <th width="50">STT</th>
              <th width="90">Hình ảnh</th>
              <th width="100">Mã chó</th> <th>Tên chó</th>
              <th>Giống chó</th>
              <th>Trang trại</th>
              <th width="90">Giới tính</th>
              <th width="120">Giá (VNĐ)</th>
              <th width="140">Trạng thái</th>
              <th width="160">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(dog, index) in filteredDogs" :key="dog.id" class="text-center align-middle">
              <td>{{ index + 1 }}</td>
              
              <td>
                <img :src="dog.image ? 'http://localhost:3000' + dog.image : 'https://via.placeholder.com/60?text=No+Img'" 
                    class="img-thumbnail rounded-circle object-fit-cover shadow-sm" style="width: 50px; height: 50px;">
              </td>

              <td class="font-weight-bold text-primary">{{ dog.maCho || '---' }}</td>
              
              <td class="font-weight-bold text-dark text-left">{{ dog.name }}</td>
              
              <td class="text-info font-weight-bold">{{ dog.breedId?.name || '---' }}</td>
              
              <td class="text-success">{{ dog.farmId?.name || '---' }}</td>
              
              <td>{{ dog.gender || '---' }}</td>
              
              <td class="text-danger font-weight-bold">{{ dog.price?.toLocaleString('vi-VN') }}</td>
              
              <td>
                <span :class="getStatusClass(dog.status)" class="badge px-3 py-2 shadow-sm mb-1">
                  {{ dog.status }}
                </span>
                <div v-if="dog.status === 'Từ chối' && dog.rejectionReason" class="text-danger small font-italic" style="line-height: 1.2;">
                  Lý do: {{ dog.rejectionReason }}
                </div>
              </td>
              
              <td>
                <div v-if="dog.status === 'Chờ duyệt'" class="d-flex justify-content-center">
                  <button class="btn btn-sm btn-success shadow-sm mr-2" @click="updateDogStatus(dog.id, 'Đã duyệt')" title="Duyệt hồ sơ">
                    <i class="fas fa-check"></i> Duyệt
                  </button>
                  <button class="btn btn-sm btn-outline-danger" @click="updateDogStatus(dog.id, 'Từ chối')" title="Từ chối">
                    <i class="fas fa-times"></i> Từ chối
                  </button>
                </div>
                <div v-else>
                  <span class="text-muted small italic"><i class="fas fa-check-double mr-1 text-success"></i> Đã xử lý</span>
                </div>
              </td>
            </tr>
            
            <tr v-if="filteredDogs.length === 0">
              <td colspan="10" class="py-5 text-center text-muted">
                <i class="fas fa-folder-open fa-2x mb-2 opacity-50"></i><br>
                Không có dữ liệu trong mục này.
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

export default {
  data() {
    return {
      dogs: [],
      searchText: "",
      filterStatus: "Chờ duyệt" 
    };
  },
  computed: {
    filteredDogs() {
      let result = this.dogs;
      if (this.filterStatus !== 'Tất cả') {
        result = result.filter(dog => dog.status === this.filterStatus);
      }
      if (this.searchText) {
        const term = this.searchText.toLowerCase();
        result = result.filter(dog => dog.name.toLowerCase().includes(term));
      }
      return result;
    }
  },
  methods: {
    async retrieveDogs() {
      try {
        this.dogs = await DogService.getAll();
      } catch (error) {
        console.error("Lỗi lấy danh sách thú cưng:", error);
      }
    },
    
    // LOGIC CẬP NHẬT TRẠNG THÁI CÓ GHI LÝ DO
    async updateDogStatus(id, newStatus) {
      let dataToUpdate = { status: newStatus };

      // Nếu Admin bấm "Từ chối"
      if (newStatus === 'Từ chối') {
        const reason = prompt("Vui lòng nhập lý do từ chối hồ sơ này (bắt buộc):");
        
        if (reason === null) return; // Hủy bỏ thao tác nếu bấm Cancel
        if (reason.trim() === "") {
          alert("❌ Bạn phải nhập lý do cụ thể để Chủ trại biết cách khắc phục!");
          return;
        }
        dataToUpdate.rejectionReason = reason; // Gắn lý do vào data để gửi lên Backend
      } else {
        // Nếu Admin bấm "Đã duyệt"
        if (!confirm(`Bạn có chắc chắn muốn phê duyệt bé chó này lên trang chủ?`)) return;
      }

      // Gọi API gửi dữ liệu
      try {
        await DogService.update(id, dataToUpdate);
        alert(`✅ Đã ${newStatus === 'Đã duyệt' ? 'phê duyệt' : 'từ chối'} thành công!`);
        this.retrieveDogs();
      } catch (error) {
        alert("❌ Lỗi: " + (error.response?.data?.message || "Không thể xử lý"));
      }
    },

    getStatusClass(status) {
      if (status === 'Chờ duyệt') return 'badge-warning text-dark';
      if (status === 'Đã duyệt') return 'badge-success';
      if (status === 'Từ chối') return 'badge-danger';
      return 'badge-secondary';
    }
  },
  mounted() {
    this.retrieveDogs();
  }
};
</script>