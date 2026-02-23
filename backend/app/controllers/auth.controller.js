const User = require("../models/user.model");
const Farm = require("../models/farm.model");
const ApiError = require("../api-error");

// 1. HÀM TẠO TÀI KHOẢN TRANG TRẠI
exports.registerFarm = async (req, res, next) => {
    try {
        const { username, password, email, fullName, phone, address, farmName, farmDescription } = req.body;

        // Kiểm tra xem tên đăng nhập hoặc email đã bị ai lấy chưa
        const userExists = await User.findOne({ 
            $or: [{ username: username }, { email: email }] 
        });
        
        if (userExists) {
            return next(new ApiError(400, "Tên đăng nhập hoặc Email đã tồn tại!"));
        }

        // Tạo tài khoản cho người dùng với vai trò mặc định là 'farm'
        const newUser = new User({
            username, password, email, fullName, role: "farm", status: "active"
        });
        const savedUser = await newUser.save();

        // Tạo hồ sơ Trang trại và gắn với tài khoản vừa tạo
        const newFarm = new Farm({
            name: farmName, address, phone, description: farmDescription,
            ownerId: savedUser._id // Liên kết cốt lõi nằm ở đây
        });
        await newFarm.save();

        return res.send({ message: "Tạo tài khoản Trại thành công!", username: savedUser.username });
    } catch (error) {
        return next(new ApiError(500, "Lỗi server: " + error.message));
    }
};

// 2. HÀM ĐĂNG NHẬP
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;

        const user = await User.findOne({ username: username });
        
        if (!user) {
            return next(new ApiError(404, "Tài khoản không tồn tại"));
        }
        if (user.password !== password) {
            return next(new ApiError(401, "Mật khẩu không đúng"));
        }
        if (user.status === 'locked') {
            return next(new ApiError(403, "Tài khoản bị khóa"));
        }

        // Trả về thẻ ra vào (chứa role để biết là admin hay farm)
        res.send({
            message: "Đăng nhập thành công",
            user: {
                id: user._id,
                username: user.username,
                role: user.role, 
                farmId: user._id 
            }
        });
    } catch (error) {
        return next(new ApiError(500, "Lỗi đăng nhập: " + error.message));
    }
};