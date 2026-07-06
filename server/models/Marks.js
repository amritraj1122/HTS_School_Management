const mongoose = require("mongoose");

const markSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    exam: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Exam",
      required: true,
    },

    studentEnrollment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "StudentEnrollment",
      required: true,
    },

    teachingAssignment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TeachingAssignment",
      required: true,
    },

    marksObtained: {
      type: Number,
      required: true,
      min: 0,
    },

    absent: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      trim: true,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

markSchema.index(
  {
    exam: 1,
    studentEnrollment: 1,
    teachingAssignment: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("Mark", markSchema);
