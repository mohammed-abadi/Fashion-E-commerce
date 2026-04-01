const express = require("express")
const router = express.Router()

const addressController = require("../controllers/addressController.js")

router.post("/", addressController.createAddress)

module.exports = router
