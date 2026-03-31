const User = require("../models/User.js")

const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id)

    if (!user) {
      return res.send("❌ User not found!")
    }

    const data = {
      _id: user._id,
      first: user.first,
      last: user.last,
      email: user.email,
      picture: user.picture,
    }

    res.render("./users/profile.ejs", { user: data })
  } catch (error) {
    console.error("⚠️ An error has occurred finding a user!", error.message)
    res.send("❌ Error finding user")
  }
}

module.exports = {
  getUserById,
}
