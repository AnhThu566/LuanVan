const Farm = require("../models/farm.model");
const ApiError = require("../api-error");

// Hàm lấy danh sách tất cả trang trại
exports.findAll = async (req, res, next) => {
    try {
        const farms = await Farm.find().populate("ownerId", "username email");
        return res.send(farms);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách trại"));
    }
};