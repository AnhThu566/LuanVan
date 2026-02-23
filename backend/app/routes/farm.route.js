const express = require("express");
const farmController = require("../controllers/farm.controller");

const router = express.Router();

router.get("/", farmController.findAll); // Đường dẫn GET /api/farms

module.exports = router;