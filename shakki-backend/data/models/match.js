const mongoose = require("mongoose")
const uv = require("mongoose-unique-validator")

// EI VALMIS

const matchSchema = mongoose.Schema({
  
})

matchSchema.plugin(uv)

matchSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject.passwordHash
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const model = mongoose.model("Match", matchSchema)

module.exports = model