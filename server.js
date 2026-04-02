const dns = require("dns")
dns.setServers(["8.8.8.8", "1.1.1.1"])
require("dotenv").config({ quiet: true })
const express = require("express")
const morgan = require("morgan")
const methodOverride = require("method-override")
const session = require("express-session")
const { MongoStore } = require("connect-mongo")
const path = require("path")

const db = require("./db")
const middleware = require("./middleware")
const authRouter = require("./routes/authRouter")
const userRouter = require("./routes/userRouter")
const addressRouter = require("./routes/addressRouter")
const productRouter = require("./routes/productRouter")
const Product = require("./models/Product")

const PORT = process.env.PORT ? process.env.PORT : 3000
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, "public")))
app.use(morgan("dev"))
app.use(methodOverride("_method"))
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
  })
)
app.use(middleware.passUserToView)

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, "views"))

app.use((req, res, next) => {
  res.locals.user = req.session.user || null
  next()
})

app.use("/auth", authRouter)
app.use("/users", userRouter)
app.use("/address", addressRouter)
app.use("/product", productRouter)

app.get("/profile", (req, res) => {
  if (!req.session.user) {
    return res.redirect("/auth/sign-in")
  }
  res.render("users/profile", { user: req.session.user })
})

app.get("/", async (req, res) => {
  try {
    const products = await Product.find()
    res.render("main", {
      user: req.session.user || null,
      products: products,
    })
  } catch (error) {
    console.error(error)
    res.render("main", {
      user: req.session.user || null,
      products: [],
    })
  }
})

app.get("/cart", (req, res) => {
  res.render("cart/index", { user: req.session.user || null })
})

app.listen(PORT, () => {
  console.log(`FashionHub Server is running on Port ${PORT} . . . `)
})
