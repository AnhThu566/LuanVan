const express = require("express");
const breedController = require("../controllers/breed.controller");

const router = express.Router();

router.route("/")
    .get(breedController.findAll)
    .post(breedController.create);

module.exports = router;