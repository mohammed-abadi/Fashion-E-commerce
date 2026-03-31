const User = require("../models/User.js")

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      email: user.email,
      picture: user.picture,
    }

    res.send(data)
  } catch (error) {
    console.error("⚠️ An error has occurred finding a user!", error.message)
    res.status(500).send("Error finding user")
  }
}

module.exports = {
  getUserById,
}
