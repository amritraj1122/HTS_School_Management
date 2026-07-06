const Student = require("../../models/Students");

const generateAdmissionNo = async () => {

    const lastStudent = await Student
        .findOne()
        .sort({ createdAt: -1 });

    if (!lastStudent) {
        return "HTS20260001";
    }

    const lastNumber = parseInt(
        lastStudent.admissionNo.slice(-4)
    );

    const nextNumber = String(lastNumber + 1)
        .padStart(4, "0");

    return `HTS2026${nextNumber}`;
};

module.exports = generateAdmissionNo;