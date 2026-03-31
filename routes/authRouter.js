const express = require("express")
const router = express.Router()

const authController = require("../controllers/authController.js")

router.post("/sign-up", authController.registerUser)
router.post("/sign-in", authController.signInUser)
router.post("/sign-out", authController.signOutUser)
router.get("/current-user", authController.getCurrentUser)

module.exports = router
