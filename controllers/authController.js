const bcrypt = require("bcrypt")
const User = require("../models/User.js")

const registerUser = async (req, res) => {
  try {
    const userInDatabase = await User.exists({ email: req.body.email })
    if (userInDatabase) {
      return res.status(400).send("❌ Email already taken!")
    }
    if (req.body.password !== req.body.confirmPassword) {
      return res.status(400).send("❌ Password and Confirm Password must match")
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 12)
    await User.create({
      email: req.body.email,
      password: hashedPassword,
      first: req.body.first,
      last: req.body.last,
      picture: req.body.picture,
    })
    res.status(201).send(`🙏 Thanks for signing up! Please sign in.`)
  } catch (error) {
    console.error("⚠️ An error has occurred registering a user!", error.message)
    res.status(500).send("An error occurred during registration")
  }
}

const signInUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email })
    if (!user) {
      return res.status(401).send("❌ Invalid email or password")
    }

    const isPasswordValid = await bcrypt.compare(
      req.body.password,
      user.password
    )
    if (!isPasswordValid) {
      return res.status(401).send("❌ Invalid email or password")
    }

    req.session.user = {
      id: user._id,
      email: user.email,
      first: user.first,
      last: user.last,
      picture: user.picture,
    }

    res.send({
      message: "✅ Successfully signed in!",
      user: req.session.user,
    })
  } catch (error) {
    console.error("⚠️ An error has occurred signing in!", error.message)
    res.status(500).send("An error occurred during sign in")
  }
}

const signOutUser = async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err)
      return res.status(500).send("Error signing out")
    }
    res.send("✅ Successfully signed out!")
  })
}

const getCurrentUser = async (req, res) => {
  if (req.session.user) {
    res.send({ user: req.session.user })
  } else {
    res.send({ user: null })
  }
}

module.exports = {
  registerUser,
  signInUser,
  signOutUser,
  getCurrentUser,
}
