const mongoose = require("mongoose")
const uv = require("mongoose-unique-validator")

// EI VALMIS

const matchSchema = mongoose.Schema({
  board: [
    [{
      type: {
        type: { type: String },
        side: {
          type: String,
          enum: ["white", "black"]
        },
        id: String,
      },
      required: true
    }]
  ],
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "",
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "",
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: "",
  },
  moveHistory: [{
    type: {
      piece: {
        type: {
          type: { type: String },
          side: {
            type: String,
            enum: ["white", "black"]
          },
          id: String,
          lastLocation: {
            type: {
              row: Number,
              column: Number,
            }
          }
        }
      },
      newLocation: {
        type: {
          row: Number,
          column: Number,
        }
      },
      castledPiece: {
        type: {
          type: { type: String },
          side: {
            type: String,
            enum: ["white", "black"]
          },
          id: String,
          lastLocation: {
            type: {
              row: Number,
              column: Number,
            }
          }
        }
      },
      promotedTo: {
        type: String,
        enum: ["queen", "knight"]
      },
      leadToCheck: {
        type: Boolean,
        default: false,
      },
      wonTheGame: {
        type: Boolean,
        default: false,
      },
      promotedPiece: {
        type: {
          type: { type: String },
          side: {
            type: String,
            enum: ["white", "black"]
          },
          id: String,
          location: {
            type: {
              row: Number,
              column: Number,
            }
          }
        }
      },
    }
  }]
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