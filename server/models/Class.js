const mongoose = require("mongoose");

const classSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    classOrder: {
        type: Number,
        required: true,
        unique: true
    },

    sections: [
      {
        type: String,
        trim: true,
      },
    ],

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model("Class", classSchema);
