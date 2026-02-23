const express = require("express");
const authController = require("../controllers/auth.controller");

const router = express.Router();

// Cửa số 1: Dùng để Đăng ký
router.post("/register-farm", authController.registerFarm);

// Cửa số 2: Dùng để Đăng nhập
router.post("/login", authController.login);

module.exports = router;