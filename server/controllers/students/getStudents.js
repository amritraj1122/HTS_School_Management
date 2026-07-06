const Student = require("../../models/Students");

const getStudents = async (req, res) => {

    try {
        const students = await Student.find().sort({ createdAt: -1});

        res.status(200).json({
            success: true, 
            total: students.length, 
            students
        });
    } catch (error) { 
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = getStudents;