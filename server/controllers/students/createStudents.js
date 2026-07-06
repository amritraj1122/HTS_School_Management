const Student = require("../../models/Students");
const generateAdmissionNo = require("../../services/student/generateAdmissionNo");

const createStudent = async (req, res) => {
    try {

        const {
            session, 
            name, 
            fatherName, 
            gender, 
            class: studentClass, 
            section
        } = req.body;

        //Generate Admission Number
        const admissionNo = await generateAdmissionNo();

        //Create Student
        const student = await Student.create({
            admissionNo, 
            session,
            name, 
            fatherName,
            gender,
            class: studentClass, 
            section
        });

        res.status(201).json({
            success: true,
            message: "Student Created Successfully",
            student
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = createStudent;