const Student = require("../../models/Student");

const searchStudents = async (req, res) => {
  try {
    const query = req.query.query?.trim();

    // Do not search if the search box is empty
    if (!query) {
      return res.status(200).json({
        success: true,
        students: [],
      });
    }

    const students = await Student.find({
      active: true,
      $or: [
        {
          admissionNo: {
            $regex: query,
            $options: "i",
          },
        },
        {
          name: {
            $regex: query,
            $options: "i",
          },
        },
      ],
    })
      .select("_id admissionNo name fatherName")
      .limit(10);

    res.status(200).json({
      success: true,
      students,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = searchStudents;