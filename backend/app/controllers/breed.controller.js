const Breed = require("../models/breed.model");
const ApiError = require("../api-error");

// 1. HÀM THÊM GIỐNG CHÓ MỚI (Dành cho Admin)
exports.create = async (req, res, next) => {
    try {
        const { name, description, origin } = req.body;
        
        // Kiểm tra xem tên giống đã được gửi lên chưa
        if (!name) {
            return next(new ApiError(400, "Tên giống chó không được để trống!"));
        }

        const newBreed = new Breed({
            name,
            description,
            origin
        });

        await newBreed.save();
        res.send({ message: "Thêm giống chó thành công!", breed: newBreed });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi tạo giống chó: " + error.message));
    }
};

// 2. HÀM LẤY DANH SÁCH GIỐNG CHÓ (Để Chủ trại chọn hoặc Khách hàng xem)
exports.findAll = async (req, res, next) => {
    try {
        const breeds = await Breed.find();
        res.send(breeds);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách giống chó"));
    }
};