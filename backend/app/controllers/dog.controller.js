const Dog = require("../models/dog.model");
const ApiError = require("../api-error");

// 1. CHỦ TRẠI ĐĂNG BÁN CHÓ
exports.create = async (req, res, next) => {
    try {
        const { name, gender, price, description, farmId, breedId } = req.body;
        
        const newDog = new Dog({
            name, gender, price, description, farmId, breedId,
            status: "pending" // Chờ Admin duyệt
        });

        await newDog.save();
        res.send({ message: "Đăng hồ sơ chó thành công (Chờ duyệt)!", dog: newDog });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi đăng chó: " + error.message));
    }
};

// 2. KHÁCH HÀNG / ADMIN XEM DANH SÁCH CHÓ
exports.findAll = async (req, res, next) => {
    try {
        // Dùng populate để lấy tên Trại và tên Giống thay vì chỉ hiện mã số ID
        const dogs = await Dog.find()
            .populate("farmId", "name address")
            .populate("breedId", "name origin");
            
        res.send(dogs);
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi lấy danh sách chó"));
    }
};

// 3. ADMIN DUYỆT CHÓ (Đổi trạng thái từ pending sang selling)
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { status } = req.body; 

        const validStatuses = ["pending", "selling", "reserved", "sold", "stopped"];
        if (!validStatuses.includes(status)) {
            return next(new ApiError(400, "Trạng thái không hợp lệ"));
        }

        const updatedDog = await Dog.findByIdAndUpdate(
            id, { status: status }, { new: true }
        );

        if (!updatedDog) return next(new ApiError(404, "Không tìm thấy hồ sơ chó"));

        res.send({ message: "Cập nhật trạng thái thành công!", dog: updatedDog });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi duyệt hồ sơ"));
    }
};