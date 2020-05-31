const mongoose = require("mongoose")
const uv = require("mongoose-unique-validator")

// EI VALMIS

const matchSchema = mongoose.Schema({
  board: [
    [{
      type: { type: String },
      side: {
        type: String,
        enum: ["white", "black"]
      },
      id: String,
    }]
  ],
  whitePlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  blackPlayer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  winner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null,
  },
  moveHistory: [{
    piece: {
      type: { type: String },
      side: {
        type: String,
        enum: ["white", "black"]
      },
      lastLocation: {
        type: {
          row: Number,
          column: Number,
        }
      }
    },
    newLocation: {
      row: Number,
      column: Number,
    },
    castledPiece: {
      type: { type: String },
      side: {
        type: String,
        enum: ["white", "black"]
      },
      lastLocation: {
        type: {
          row: Number,
          column: Number,
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
    isSkip: {
      type: Boolean,
      default: false,
    },
    promotedPiece: {
      type: { type: String },
      side: {
        type: String,
        enum: ["white", "black"]
      },
      location: {
        type: {
          row: Number,
          column: Number,
        }
      }
    },
  }]
})

matchSchema.plugin(uv)

matchSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

const model = mongoose.model("Match", matchSchema)

module.exports = model