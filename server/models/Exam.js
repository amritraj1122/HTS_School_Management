const mongoose = require("mongoose");

const examSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    examCode: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },

    examName: {
      type: String,
      required: true,
      trim: true,
    },

    maxMarks: {
      type: Number,
      required: true,
    },

    displayOrder: {
      type: Number,
      required: true,
    },
    resultType: {
      type: String,
      enum: ["HALF_YEARLY EXAMINATION", "ANNUAL EXAMINATION"],
      required: true,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

examSchema.index(
  {
    session: 1,
    examCode: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Exam", examSchema);
