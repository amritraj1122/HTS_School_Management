const Subject = require("../../models/Subject");

const getSubject = async (req, res) => {

    try {

        const subject = await Subject.findById(req.params.id);

        if (!subject) {

            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });

        }

        res.status(200).json({
            success: true,
            subject
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });

    }

};

module.exports = getSubject;