import createApiClient from "./api.service";

class DogService {
    constructor(baseUrl = "/api/dogs") {
        this.api = createApiClient(baseUrl);
    }
    //tao moi 1 con cho
    async create(data) {
        return (await this.api.post("/", data, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })).data;
    }
    //lay tat ca cac con cho
    async getAll() {
        return (await this.api.get("/")).data;
    }
    //cap nhat trang thai cua con cho
    async update(id, data) {
        return (await this.api.put(`/${id}`, data)).data;
    }
}
export default new DogService();