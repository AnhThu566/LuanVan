const express = require("express");
const dogController = require("../controllers/dog.controller");

const router = express.Router();

router.route("/")
    .get(dogController.findAll)
    .post(dogController.create);

// Đường dẫn riêng để Admin duyệt chó
router.put("/:id/status", dogController.updateStatus);

module.exports = router;