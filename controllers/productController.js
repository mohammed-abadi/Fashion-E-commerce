const Product = require("../models/Product")
const Review = require("../models/Review")

// Get all products (API)
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
    res.json(products)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Server error" })
  }
}

// Get single product with reviews
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

// Add review to product
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

// Seed products (run once to add products to database)
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
      {
        name: "blue striped shirt",
        price: 72,
        image:
          "https://img-lcwaikiki.mncdn.com/mnpadding/480/640/ffffff/pim/productimages/20261/8497803/v1/l_20261-s68231z8-len-101-78-96-187_a.jpg",
        category: "Shirts",
        description: "Modern blue striped shirt for a sophisticated look.",
      },
      {
        name: "yellow striped shirt",
        price: 90,
        image: "https://dfcdn.defacto.com.tr/480/B4642AX_24SP_GN516_03_01.jpg",
        category: "Shirts",
        description: "Vibrant yellow striped shirt to brighten your wardrobe.",
      },
      {
        name: "gray cotton shirt",
        price: 102,
        image: "https://dfcdn.defacto.com.tr/768/S1240AZ_22WN_WT33_01_01.jpg",
        category: "Shirts",
        description: "Premium gray cotton shirt, soft and durable.",
      },
      {
        name: "white oversized t-shirt",
        price: 36,
        image:
          "https://i.pinimg.com/originals/28/1f/ea/281fea5c66b6b059acdb20ee5e00461e.jpg",
        category: "T-Shirts",
        description: "Relaxed fit oversized t-shirt for ultimate comfort.",
      },
      {
        name: "gray T-shirt",
        price: 31,
        image:
          "https://st.mngbcn.com/rcs/pics/static/T4/fotos/S20/47001057_91.jpg?ts=1664876790615&imwidth=337&imdensity=2",
        category: "T-Shirts",
        description: "Essential gray t-shirt, perfect for everyday wear.",
      },
      {
        name: "black oversized t-shirt",
        price: 36,
        image:
          "https://i.pinimg.com/originals/bf/80/51/bf80515a5be6282c6128312ac4691d83.jpg",
        category: "T-Shirts",
        description: "Sleek black oversized t-shirt for a casual look.",
      },
      {
        name: "pink t-shirt",
        price: 36,
        image:
          "https://frankybros.com/wp-content/uploads/2021/12/light-pink-t-shirt-for-mens-online-in-india-franky-bros-brand.webp",
        category: "T-Shirts",
        description: "Trendy pink t-shirt for a pop of color.",
      },
      {
        name: "blue t-shirt",
        price: 29,
        image: "https://oldnavy.gap.com/webcontent/0053/414/966/cn53414966.jpg",
        category: "T-Shirts",
        description: "Classic blue t-shirt, versatile and comfortable.",
      },
      {
        name: "light blue jeans",
        price: 48,
        image:
          "https://lscoglobal.scene7.com/is/image/lscoglobal/006IC-0001_M_JEANS_EXTRA_BAGGY?fmt=jpeg&qlt=70&resMode=sharp2&fit=crop,1&op_usm=0.6,0.6,8&wid=1200&hei=1500",
        category: "Jeans",
        description: "Stylish light blue jeans with a modern fit.",
      },
      {
        name: "black jeans",
        price: 48,
        image:
          "https://n.nordstrommedia.com/it/522a9921-54ba-417a-932d-deb2253abccb.jpeg?h=368&w=240&dpr=2",
        category: "Jeans",
        description: "Sleek black jeans for a sharp look.",
      },
      {
        name: "white jeans",
        price: 48,
        image:
          "https://i.pinimg.com/736x/c5/d9/dc/c5d9dcb899968663a681995670ae3a51.jpg",
        category: "Jeans",
        description: "Crisp white jeans for a fresh style.",
      },
      {
        name: "Baggy Jeans",
        price: 52,
        image:
          "https://i.pinimg.com/736x/60/fb/73/60fb7343703b69c4333eda70048857f7.jpg",
        category: "Jeans",
        description: "Comfortable baggy jeans with a relaxed fit.",
      },
      {
        name: "gray Jeans",
        price: 52,
        image:
          "https://img.ltwebstatic.com/images3_pi/2024/01/12/96/17050384759fb49efca68e2355e6a5cd43693f8f70_thumbnail_900x.webp",
        category: "Jeans",
        description: "Modern gray jeans for a contemporary look.",
      },
      {
        name: "casual shorts",
        price: 40,
        image:
          "https://cdna.lystit.com/photos/2012/04/13/dockers-khaki-chino-shorts-product-2-3210366-956989973.jpeg",
        category: "Shorts",
        description: "Comfortable casual shorts for warm days.",
      },
      {
        name: "light shorts",
        price: 55,
        image: "https://oldnavy.gap.com/webcontent/0053/455/292/cn53455292.jpg",
        category: "Shorts",
        description: "Lightweight shorts perfect for summer.",
      },
      {
        name: "Off-white shorts",
        price: 55,
        image:
          "https://cdnb.lystit.com/photos/2013/11/19/ralph-lauren-classic-stone-polo-core-classicfit-flatfront-chino-shorts-product-1-15069042-867102250.jpeg",
        category: "Shorts",
        description: "Stylish off-white shorts for a clean look.",
      },
      {
        name: "green shorts",
        price: 55,
        image: "https://oldnavy.gap.com/webcontent/0055/694/413/cn55694413.jpg",
        category: "Shorts",
        description: "Vibrant green shorts for a pop of color.",
      },
      {
        name: "brown shorts",
        price: 39,
        image: "https://oldnavy.gap.com/webcontent/0028/574/898/cn28574898.jpg",
        category: "Shorts",
        description: "Classic brown shorts for casual outings.",
      },
      {
        name: "Old Navy shoes",
        price: 88,
        image:
          "https://www.apetogentleman.com/wp-content/uploads/2023/06/BoatShoeBrandsMain.jpg",
        category: "Shoes",
        description: "Comfortable and stylish everyday shoes.",
      },
      {
        name: "formal shoes",
        price: 97,
        image:
          "https://www.apetogentleman.com/wp-content/uploads/2023/04/DressShoesBrandsMain2.jpg",
        category: "Shoes",
        description: "Elegant formal shoes for special occasions.",
      },
      {
        name: "leather shoes",
        price: 130,
        image:
          "https://www.werd.com/wp-content/uploads/2024/08/best-business-casual-shoes.jpg",
        category: "Shoes",
        description: "Premium leather shoes for a sophisticated look.",
      },
      {
        name: "casual shoes",
        price: 75,
        image:
          "https://i.etsystatic.com/37776049/r/il/3b3e6d/4203209866/il_fullxfull.4203209866_hb1n.jpg",
        category: "Shoes",
        description: "Versatile casual shoes for everyday wear.",
      },
      {
        name: "white shoes",
        price: 60,
        image:
          "https://thursdayboots.com/cdn/shop/products/1024x1024-Men-HighTop-White-011722-3.jpg?v=1668644494",
        category: "Shoes",
        description: "Clean white shoes that match any outfit.",
      },
      {
        name: "black leather watch",
        price: 206,
        image:
          "https://cdn.luxatic.com/wp-content/uploads/2023/02/Best-Gold-Watches-for-Men.jpg",
        category: "Watches",
        description: "Elegant black leather watch for a classic look.",
      },
      {
        name: "brown leather watch",
        price: 190,
        image:
          "https://mensflair.com/wp-content/uploads/2023/07/longines-dolce-vita-on-wrist.jpg",
        category: "Watches",
        description: "Sophisticated brown leather watch.",
      },
      {
        name: "Steel watch",
        price: 122,
        image:
          "https://wwd.com/wp-content/uploads/2023/10/best-watches-for-men.png?w=911",
        category: "Watches",
        description: "Durable steel watch with modern design.",
      },
      {
        name: "casual watch",
        price: 90,
        image:
          "https://cdn.watchesyoucanafford.com/wp-content/uploads/2022/08/Best-Affordable-Chronograph-Watches.jpg",
        category: "Watches",
        description: "Versatile casual watch for daily wear.",
      },
      {
        name: "new stylish watch",
        price: 240,
        image:
          "https://cdn.luxe.digital/media/2021/07/02104538/best-men-watches-review-luxe-digital@2x.jpg",
        category: "Watches",
        description: "Trendy stylish watch for fashion-forward individuals.",
      },
    ]

    // Clear existing products first (optional)
    await Product.deleteMany({})

    // Insert new products
    await Product.insertMany(products)
    res.send("Products seeded successfully!")
  } catch (error) {
    console.error(error)
    res.status(500).send("Error seeding products")
  }
}

module.exports = {
  getAllProducts,
  getProduct,
  addReview,
  seedProducts,
}
