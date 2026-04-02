const Address = require("../models/Address")

const getUserAddress = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.status(401).json({ error: "Not logged in" })
    }
    const address = await Address.findOne({ user: req.session.user._id })
    res.json(address || null)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: "Error fetching address" })
  }
}

const saveAddress = async (req, res) => {
  try {
    const { address, street, city, payment } = req.body
    const userId = req.session.user._id

    let existingAddress = await Address.findOne({ user: userId })

    if (existingAddress) {
      existingAddress.address = address
      existingAddress.street = street
      existingAddress.city = city
      existingAddress.payment = payment
      await existingAddress.save()
    } else {
      await Address.create({
        address,
        street,
        city,
        payment,
        user: userId,
      })
    }

    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      res.json({ success: true, message: "Address saved successfully" })
    } else {
      res.redirect("/profile")
    }
  } catch (error) {
    console.error("⚠️ An error has occurred saving address!", error.message)
    if (req.xhr || req.headers.accept.indexOf("json") > -1) {
      res.status(500).json({ error: "Error saving address" })
    } else {
      res.send("❌ Error saving address")
    }
  }
}

const renderProfile = async (req, res) => {
  try {
    if (!req.session.user) {
      return res.redirect("/auth/sign-in")
    }
    const address = await Address.findOne({ user: req.session.user._id })
    res.render("users/profile", {
      user: req.session.user,
      address: address || null,
    })
  } catch (error) {
    console.error(error)
    res.render("users/profile", {
      user: req.session.user,
      address: null,
    })
  }
}

const renderCart = async (req, res) => {
  try {
    const address = req.session.user
      ? await Address.findOne({ user: req.session.user._id })
      : null
    res.render("cart/index", {
      user: req.session.user || null,
      address: address || null,
    })
  } catch (error) {
    console.error(error)
    res.render("cart/index", {
      user: req.session.user || null,
      address: null,
    })
  }
}

module.exports = {
  getUserAddress,
  saveAddress,
  renderProfile,
  renderCart,
}
