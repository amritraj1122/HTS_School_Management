const Class = require("../../models/Class");

const createClass = async (req, res) => {
  try {
    const { className, classOrder, sections } = req.body;

    // Check if class already exists
    const existingClass = await Class.findOne({ 
        $or: [
            { className },
            { classOrder }
        ]
     });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        message: "Class already exists.",
      });
    }

    const newClass = await Class.create({
      className,
      classOrder,
      sections,
    });

    res.status(201).json({
      success: true,
      message: "Class Created Successfully",
      class: newClass,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = createClass;
