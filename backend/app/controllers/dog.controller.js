const Dog = require("../models/dog.model");
const ApiError = require("../api-error");
const Farm = require("../models/farm.model"); 
const Breed = require("../models/breed.model");

// 1. CHỦ TRẠI ĐĂNG BÁN CHÓ
// 1. CHỦ TRẠI ĐĂNG BÁN CHÓ (Đã tích hợp tự động sinh mã TC001...)
exports.create = async (req, res, next) => {
    try {
        // 1. KHÔNG lấy image từ req.body nữa
        const { name, gender, price, description, farmId, breedId } = req.body;
        
        // 2. 👉 XỬ LÝ ẢNH (Nhận file từ Multer)
        let imagePath = "";
        if (req.file) {
            imagePath = `/uploads/${req.file.filename}`; // Lưu đường dẫn thật của ảnh
        } else {
            return next(new ApiError(400, "Vui lòng chọn hình ảnh đại diện cho bé chó!"));
        }

        // 3. LOGIC TỰ ĐỘNG SINH MÃ CHÓ (TC001, TC002,...)
        const lastDog = await Dog.findOne().sort({ maCho: -1 });
        let nextCode = "TC001";

        if (lastDog && lastDog.maCho) {
            const lastNumber = parseInt(lastDog.maCho.replace("TC", ""), 10);
            nextCode = "TC" + (lastNumber + 1).toString().padStart(3, "0");
        }
        
        // 4. LƯU VÀO DATABASE
        const newDog = new Dog({
            maCho: nextCode,
            name, gender, price, description, farmId, breedId,
            image: imagePath, // 👉 Gán đường dẫn ảnh dạng chuỗi (String) vào đây
            status: "Chờ duyệt"
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

// 3. ADMIN DUYỆT CHÓ (Đổi trạng thái của con chó)
exports.updateStatus = async (req, res, next) => {
    try {
        const { id } = req.params; 
        const { status, rejectionReason } = req.body; // Lấy thêm rejectionReason từ Frontend gửi lên

        const validStatuses = ["Chờ duyệt", "Đã duyệt", "Từ chối", "Đã đặt cọc", "Đã bán", "Ngừng bán"];
        if (!validStatuses.includes(status)) {
            return next(new ApiError(400, "Trạng thái không hợp lệ"));
        }

        // Tạo object chứa dữ liệu cần cập nhật
        const updateData = { status: status };
        
        // Nếu là "Từ chối" thì lưu lý do vào. Nếu là "Đã duyệt" thì xóa lý do cũ đi (nếu có).
        if (status === "Từ chối" && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        } else if (status === "Đã duyệt") {
            updateData.rejectionReason = ""; 
        }

        const updatedDog = await Dog.findByIdAndUpdate(
            id, updateData, { new: true }
        );

        if (!updatedDog) return next(new ApiError(404, "Không tìm thấy hồ sơ chó"));

        res.send({ message: "Cập nhật trạng thái thành công!", dog: updatedDog });
    } catch (error) {
        return next(new ApiError(500, "Lỗi khi duyệt hồ sơ"));
    }
};