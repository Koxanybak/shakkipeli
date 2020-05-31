const mongoose = require("mongoose")
const uv = require("mongoose-unique-validator")

const friendRequestSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  to: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
})

friendRequestSchema.plugin(uv)

friendRequestSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const model = mongoose.model("FriendRequest", friendRequestSchema)

module.exports = model