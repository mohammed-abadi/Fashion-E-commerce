const express = require("express")
const router = express.Router()
const productController = require("../controllers/productController")

router.get("/seed", productController.seedProducts)

router.get("/api", productController.getAllProducts)

router.get("/:id", productController.getProduct)

router.post("/:id/review", productController.addReview)

router.post(
  "/:productId/review/:reviewId/delete",
  productController.deleteReview
)

module.exports = router
