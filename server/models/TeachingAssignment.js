const mongoose = require("mongoose");

const teachingAssignmentSchema = new mongoose.Schema(
  {
    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
      required: true,
    },

    teacher: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teacher",
      required: true,
    },

    class: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Class",
      required: true,
    },

    section: {
      type: String,
      required: true,
      trim: true,
    },

    subject: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Subject",
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

teachingAssignmentSchema.index(
  {
    session: 1,
    teacher: 1,
    class: 1,
    section: 1,
    subject: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("TeachingAssignment", teachingAssignmentSchema);
