<template>
  <div class="card shadow-sm border-0 animate__animated animate__fadeIn">
    <div class="card-header bg-success text-white py-3 d-flex align-items-center">
      <router-link to="/farm/dashboard" class="btn btn-sm btn-light text-success mr-3">
        <i class="fas fa-arrow-left"></i> Trở về
      </router-link>
      <h5 class="mb-0 font-weight-bold">
        <i class="fas fa-paw mr-2"></i> ĐĂNG HỒ SƠ THÚ CƯNG MỚI
      </h5>
    </div>

    <div class="card-body p-4 p-md-5">
      <form @submit.prevent="submitDogProfile">
        <div class="row">
          <div class="col-md-7 border-right pr-md-4">
            <h6 class="text-success font-weight-bold border-bottom pb-2 mb-4">Thông tin chi tiết</h6>
            
            <div class="form-group mb-3">
              <label class="font-weight-bold">Tên bé chó <span class="text-danger">*</span></label>
              <input type="text" class="form-control" v-model="dogLocal.name" placeholder="VD: Bé LuLu đáng yêu" required>
            </div>

            <div class="row mb-3">
              <div class="col-md-6 form-group">
                <label class="font-weight-bold">Giống chó <span class="text-danger">*</span></label>
                <select class="form-control" v-model="dogLocal.breedId" required>
                  <option value="" disabled>-- Chọn giống chó --</option>
                  <option v-for="breed in breeds" :key="breed.id || breed._id" :value="breed.id || breed._id">
                    {{ breed.name }}
                  </option>
                </select>
              </div>
              <div class="col-md-6 form-group">
                <label class="font-weight-bold">Giới tính <span class="text-danger">*</span></label>
                <select class="form-control" v-model="dogLocal.gender" required>
                  <option value="Đực">Đực</option>
                  <option value="Cái">Cái</option>
                </select>
              </div>
            </div>

            <div class="form-group mb-3">
              <label class="font-weight-bold">Giá bán (VNĐ) <span class="text-danger">*</span></label>
              <input type="number" class="form-control" v-model="dogLocal.price" placeholder="VD: 5000000" min="0" required>
            </div>

            <div class="form-group mb-3">
              <label class="font-weight-bold">Mô tả thêm</label>
              <textarea class="form-control" v-model="dogLocal.description" rows="4" placeholder="Nhập thông tin tiêm phòng, tính cách của bé..."></textarea>
            </div>
          </div>

          <div class="col-md-5 pl-md-4">
            <h6 class="text-success font-weight-bold border-bottom pb-2 mb-4">Hình ảnh đại diện <span class="text-danger">*</span></h6>
            
            <div class="form-group text-center">
              <div class="border rounded mb-3 d-flex align-items-center justify-content-center bg-light shadow-sm" style="height: 280px; overflow: hidden;">
                <img v-if="previewImage" :src="previewImage" alt="Preview" style="object-fit: cover; width: 100%; height: 100%;">
                <div v-else class="text-muted">
                  <i class="fas fa-image fa-4x mb-2 opacity-25"></i>
                  <p class="small">Chọn một bức ảnh thật đẹp nhé!</p>
                </div>
              </div>

              <div class="custom-file text-left">
                <input type="file" class="custom-file-input" id="dogImage" @change="handleFileUpload" accept="image/*" required>
                <label class="custom-file-label text-truncate" for="dogImage">
                  {{ selectedFileName || 'Tải ảnh bé chó lên...' }}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div class="text-center mt-4 border-top pt-4">
          <router-link to="/farm/dashboard" class="btn btn-outline-secondary px-5 mr-3 font-weight-bold">HỦY BỎ</router-link>
          <button type="submit" class="btn btn-success px-5 font-weight-bold shadow-sm" :disabled="isSubmitting">
            <i class="fas fa-paper-plane mr-2"></i> {{ isSubmitting ? 'ĐANG XỬ LÝ...' : 'GỬI ĐĂNG BÁN' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import BreedService from "@/services/breed.service";
import DogService from "@/services/dog.service";
import createApiClient from "@/services/api.service";

export default {
  data() {
    return {
      dogLocal: { name: "", breedId: "", gender: "Đực", price: "", description: "", farmId: "" },
      breeds: [],
      currentUser: null,
      selectedFile: null,
      selectedFileName: "",
      previewImage: null,
      isSubmitting: false
    };
  },
  async created() {
    const userData = localStorage.getItem("user");
    if (userData) {
      this.currentUser = JSON.parse(userData);
      await this.fetchMyFarmId();
    }
    
    try {
      this.breeds = await BreedService.getAll();
    } catch (error) {
      console.log(error);
    }
  },
  methods: {
    // Tự động tìm farmId để gán ngầm vào dữ liệu gửi đi
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
        if(myFarm) {
          this.dogLocal.farmId = myFarm._id || myFarm.id; 
        }
      } catch (error) {
        console.log("Lỗi tìm trại:", error);
      }
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.selectedFile = file;
        this.selectedFileName = file.name;
        this.previewImage = URL.createObjectURL(file); 
      }
    },
    async submitDogProfile() {
      if(!this.dogLocal.farmId) {
        alert("Lỗi: Tài khoản của bạn chưa được liên kết với Trang trại nào!");
        return;
      }
      if (!this.selectedFile) {
        alert("Vui lòng chọn hình ảnh cho bé chó!");
        return;
      }

      this.isSubmitting = true;

      try {
        const formData = new FormData();
        formData.append("name", this.dogLocal.name);
        formData.append("breedId", this.dogLocal.breedId);
        formData.append("gender", this.dogLocal.gender);
        formData.append("price", this.dogLocal.price);
        formData.append("description", this.dogLocal.description);
        formData.append("farmId", this.dogLocal.farmId);
        formData.append("image", this.selectedFile);

        await DogService.create(formData);
        
        alert("🎉 Đã gửi hồ sơ thú cưng thành công! Vui lòng chờ Admin phê duyệt.");
        this.$router.push("/farm/dashboard"); // Chuyển về trang danh sách sau khi đăng xong

      } catch (error) {
        alert("❌ Lỗi khi đăng: " + (error.response?.data?.message || error.message));
      } finally {
        this.isSubmitting = false;
      }
    }
  }
};
</script>

<style scoped>
.custom-file-label::after { content: "Chọn ảnh" !important; background-color: #28a745; color: white; }
</style>