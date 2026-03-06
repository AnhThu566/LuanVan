    <template>
    <div class="container mt-5">
        <div class="text-center mb-5">
        <h1 class="text-primary font-weight-bold"><i class="fas fa-paw"></i> Chào mừng đến với PetShop</h1>
        <p class="text-muted">Nơi tìm kiếm người bạn bốn chân đáng yêu của bạn!</p>
        </div>

        <div class="row">
        <div class="col-md-4 mb-4" v-for="dog in availableDogs" :key="dog._id">
            <div class="card h-100 shadow-sm border-0">
            <img src="https://via.placeholder.com/300x200?text=Pet+Image" class="card-img-top" alt="Dog Image">
            
            <div class="card-body">
                <h4 class="card-title text-success font-weight-bold">{{ dog.name }}</h4>
                <p class="card-text mb-1">
                <strong><i class="fas fa-dna"></i> Giống:</strong> {{ dog.breedId?.name || 'Đang cập nhật' }}
                </p>
                <p class="card-text mb-1">
                <strong><i class="fas fa-venus-mars"></i> Giới tính:</strong> {{ dog.gender }}
                </p>
                <p class="card-text mb-1">
                <strong><i class="fas fa-home"></i> Trại chó:</strong> {{ dog.farmId?.name || 'Đang cập nhật' }}
                </p>
                <h5 class="text-danger mt-3 font-weight-bold">{{ dog.price?.toLocaleString('vi-VN') }} VNĐ</h5>
            </div>
            
            <div class="card-footer bg-white border-0 text-center pb-3">
                <button class="btn btn-outline-primary w-100" @click="viewDetail(dog)">
                <i class="fas fa-info-circle"></i> Xem Chi Tiết
                </button>
            </div>
            </div>
        </div>

        <div v-if="availableDogs.length === 0" class="col-12 text-center mt-5">
            <h4 class="text-muted">Hiện tại chưa có thú cưng nào được mở bán. Mời bạn quay lại sau!</h4>
        </div>
        </div>
    </div>
    </template>

    <script>
    import DogService from "@/services/dog.service";

    export default {
    data() {
        return {
        allDogs: [],
        };
    },
    computed: {
        // ĐÂY LÀ ĐIỂM ĂN TIỀN NHẤT CỦA TRANG CHỦ: 
        availableDogs() {
        return this.allDogs.filter(dog => dog.status === 'Đã duyệt');
        }
    },
    async created() {
        await this.fetchDogs();
    },
    methods: {
        async fetchDogs() {
        try {
            this.allDogs = await DogService.getAll();
        } catch (error) {
            console.log("Lỗi lấy danh sách chó trang chủ:", error);
        }
        },
        viewDetail(dog) {
        alert(`Chức năng xem chi tiết của bé ${dog.name} sẽ làm ở bước sau!`);
        }
    }
    };
    </script>

    <style scoped>
    .card {
    transition: transform 0.2s;
    }
    .card:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0,0,0,0.1) !important;
    }
    </style>