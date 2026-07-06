const TeachingAssignment = require("../../models/TeachingAssignment");
const createAssignment = async (req, res) => {
  try {
    const {
      session,
      teacher,
      class: classId,
      section,
      subject,
      active,
    } = req.body;
    //Check the duplicate assignment
    const existingAssignment = await TeachingAssignment.findOne({
      session,
      teacher,
      class: classId,
      section,
      subject,
    });

    if (existingAssignment) {
      return res.status(400).json({
        success: false,
        message: "This assignment already exists.",
      });
    }

    const assignment = await TeachingAssignment.create({
      session,
      teacher,
      class: classId,
      section,
      subject,
      active,
    });

    res.status(201).json({
      success: true,
      message: "Teaching Assignment Created Successfully",
      assignment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = createAssignment;
