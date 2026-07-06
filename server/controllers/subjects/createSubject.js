const Subject = require("../../models/Subject");

const createSubject = async (req, res) => {
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

    // Check duplicate subject for same class
    const existingSubject = await Subject.findOne({
      subjectCode,
      class: className,
    });

    if (existingSubject) {
      return res.status(400).json({
        success: false,
        message: "Subject already exists for this class.",
      });
    }

    const subject = await Subject.create({
      subjectCode,
      subjectName,
      class: className,
      fullMarks: Number(fullMarks),
      passingMarks: Number(passingMarks),
      active: active !== undefined ? active : true,
    });

    res.status(201).json({
      success: true,
      message: "Subject Created Successfully",
      subject,
    });
  } catch (error) {
    console.log("Create Subject Error:", error);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = createSubject;
