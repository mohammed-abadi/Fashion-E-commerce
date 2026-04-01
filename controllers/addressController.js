const Address = require("../models/Address")

const createAddress = async (req, res) => {
  try {
    const address = await Address.create(req.body)

    res.redirect("/")
  } catch (error) {
    console.error("⚠️ An error has occurred finding a user!", error.message)
    res.send("❌  finding user")
  }
}

module.exports = {
  createAddress,
}
