const bcrypt = require("bcryptjs");
const Admin = require("../models/Admin");

const createAdmin = async ()=>{

    const existingAdmin = await Admin.findOne({
        username:"admin"
    });

    if(existingAdmin){
       
        return;
    }

    const hashedPassword = await bcrypt.hash("admin123",10);

    await Admin.create({
        username:"admin",
        password:hashedPassword
    });
    
    
};

module.exports = createAdmin;
