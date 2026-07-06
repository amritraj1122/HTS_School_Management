const Class = require("../../models/Class");

const getClasses = async (req, res) => {
  try {
    const classes = await Class.find().sort({ classOrder: 1 });

    res.status(200).json({
      success: true,

      total: classes.length,

      classes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,

      message: error.message,
    });
  }
};

module.exports = getClasses;
