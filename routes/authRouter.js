const express = require("express")
const router = express.Router()
const authController = require("../controllers/authController.js")

router.get("/sign-up", (req, res) => {
  res.render("./auth/sign-up.ejs")
})

router.post("/sign-up", authController.registerUser)

router.get("/sign-in", (req, res) => {
  res.render("./auth/sign-in.ejs")
})

router.post("/sign-in", authController.signInUser)

router.get("/sign-out", authController.signOutUser)

router.get("/:id/update-password", (req, res) => {
  res.render("./auth/update-password.ejs")
})

router.put("/:id", authController.updatePassword)

module.exports = router
