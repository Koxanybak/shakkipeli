const mongoose = require("mongoose")
const uv = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minlength: 2,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  friends: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  }],
  tag: {
    type: String,
    required: true,
  },
})

userSchema.plugin(uv)

userSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const model = mongoose.model("User", userSchema)

module.exports = model