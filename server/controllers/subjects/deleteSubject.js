const Subject = require("../../models/Subject");

const deleteSubject = async (req, res) => {

    try {

        const subject = await Subject.findByIdAndDelete(req.params.id);

        if (!subject) {

            return res.status(404).json({

                success: false,
                message: "Subject not found"

            });

        }

        res.status(200).json({

            success: true,
            message: "Subject Deleted Successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            success: false,
            message: error.message

        });

    }

};

module.exports = deleteSubject;