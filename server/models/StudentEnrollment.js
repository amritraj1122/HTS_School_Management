const mongoose = require("mongoose");

const studentEnrollmentSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },

    session: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
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

    rollNo: {
      type: Number,
      required: true,
      min: 1,
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

// One student can have only one enrollment per session
studentEnrollmentSchema.index(
  {
    student: 1,
    session: 1,
  },
  {
    unique: true,
  },
);

// Roll number must be unique within a class & section
studentEnrollmentSchema.index(
  {
    session: 1,
    class: 1,
    section: 1,
    rollNo: 1,
  },
  {
    unique: true,
  },
);

module.exports = mongoose.model("StudentEnrollment", studentEnrollmentSchema);
