const express = require("express")
const router = express.Router()
const addressController = require("../controllers/addressController.js")

router.post("/", addressController.saveAddress)
router.get("/api", addressController.getUserAddress)

module.exports = router
