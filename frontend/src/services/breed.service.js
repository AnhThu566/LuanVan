import createApiClient from "./api.service";

class BreedService {
    constructor(baseUrl = "/api/breeds") {
        this.api = createApiClient(baseUrl);
    }

    // Lấy danh sách tất cả giống chó
    async getAll() {
        return (await this.api.get("/")).data;
    }

    // Thêm một giống chó mới
    async create(data) {
        // Cần thêm headers 'Content-Type': 'multipart/form-data' để axios biết đang gửi file
        return (await this.api.post("/", data, {
            headers: { "Content-Type": "multipart/form-data" }
        })).data;
    }

    // Xóa một giống chó theo ID
    async delete(id) {
        return (await this.api.delete(`/${id}`)).data;
    }

    // Cập nhật thông tin giống chó (Dành cho chức năng Sửa sau này)
    async update(id, data) {
        return (await this.api.put(`/${id}`, data, {
            headers: { "Content-Type": "multipart/form-data" }
        })).data;
    }

    // Lấy mã giống chó tiếp theo (Dành cho chức năng Thêm mới)
    async getNextCode() {
        return (await this.api.get("/next-code")).data;
    }
}

export default new BreedService();