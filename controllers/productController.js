const Product = require("../models/Product")
const Review = require("../models/Review")

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).send("Product not found")
    }

    const reviews = await Review.find({ product: product._id }).sort({
      createdAt: -1,
    })

    res.render("product", {
      product,
      reviews,
      user: req.session.user || null,
    })
  } catch (error) {
    console.error(error)
    res.status(500).send("Server error")
  }
}

const addReview = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/sign-in")
    }

    const { rating, comment } = req.body
    const productId = req.params.id

    const review = await Review.create({
      product: productId,
      user: req.session.user._id,
      userName: `${req.session.user.first} ${req.session.user.last}`,
      rating: parseInt(rating),
      comment: comment,
    })

    res.redirect(`/product/${productId}`)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error adding review")
  }
}

const deleteReview = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/sign-in")
    }

    const { productId, reviewId } = req.params
    const review = await Review.findById(reviewId)

    if (!review || review.user.toString() !== req.session.user._id) {
      return res
        .status(403)
        .send("You are not authorized to delete this review")
    }

    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/product/${productId}`)
  } catch (error) {
    console.error(error)
    res.status(500).send("Error deleting review")
  }
}

const seedProducts = async (req, res) => {
  try {
    const products = [
      {
        name: "striped cotton shirt",
        price: 80,
        image: "https://dfcdn.defacto.com.tr/768/Z5182AZ_23SP_BG350_02_03.jpg",
        category: "Shirts",
        description:
          "Comfortable striped cotton shirt perfect for casual wear.",
      },
      {
        name: "white striped shirt",
        price: 53,
        image:
          "https://img-lcwaikiki.mncdn.com/mnpadding/480/640/ffffff/pim/productimages/20252/8869601/v1/l_20252-w5o571z8-lhw-98-76-98-188_a.jpg",
        category: "Shirts",
        description: "Classic white striped shirt, breathable and stylish.",
      },
    ]

    await Product.deleteMany({})
    await Product.insertMany(products)
    res.send("Products seeded successfully!")
  } catch (error) {
    console.error(error) / res.status(500).send("Error seeding products")
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  addReview,
  deleteReview,
  seedProducts,
}
