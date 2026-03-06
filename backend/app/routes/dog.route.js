const express = require("express");
const dogController = require("../controllers/dog.controller");

// 👉 THÊM DÒNG NÀY: Gọi middleware xử lý file ảnh (Multer) vào
// Lưu ý: Em xem lại thư mục của mình xem file upload đang nằm ở đâu để require cho đúng nhé!
// (Nếu em không nhớ, hãy mở file breed.route.js của em ra xem file upload được require từ đường dẫn nào rồi copy y hệt sang đây).
const upload = require("../middlewares/upload.middleware"); 

const router = express.Router();

router.route("/")
    .get(dogController.findAll)
    // 👉 SỬA DÒNG NÀY: Chèn upload.single("image") vào trước hàm create
    .post(upload.single("image"), dogController.create);

// Đường dẫn riêng để Admin duyệt chó
router.route("/:id")
    .put(dogController.updateStatus); 

module.exports = router;