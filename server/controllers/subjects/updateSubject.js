const Subject = require("../../models/Subject");

const updateSubject = async (req, res) => {
  try {
    const {
      subjectCode,
      subjectName,
      class: className,
      fullMarks,
      passingMarks,
      active,
    } = req.body;

    // Validation
    if (
      !subjectCode ||
      !subjectName ||
      !className ||
      fullMarks === undefined ||
      passingMarks === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "Please fill all required fields.",
      });
    }

    // Check duplicate subject
    const existingSubject = await Subject.findOne({
      subjectCode,
      class: className,
      _id: { $ne: req.params.id },
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists for this class.",
      });
    }

    const subject = await Subject.findByIdAndUpdate(
      req.params.id,
      {
        subjectCode,
        subjectName,
        class: className,
        fullMarks: Number(fullMarks),
        passingMarks: Number(passingMarks),
        active,
      },
      {
        new: true,
        runValidators: true,
      },
    );

    if (!subject) {
      return res.status(404).json({
        success: false,
        message: "Subject not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Subject Updated Successfully",
      subject,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = updateSubject;
