const Subject = require("../../models/Subject");

const getSubjects = async (req, res) => {

    try {

        const subjects = await Subject.find().sort({
            class: 1,
            subjectName: 1
        });

        res.status(200).json({
            success: true,
            total: subjects.length,
            subjects
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = getSubjects;