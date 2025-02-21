const validator = require("validator");

const ValidateSignupData = (req) =>{
    const { firstname, lastname ,email, password } = req?.body;

    if(!validator.isEmail(email)){
        throw new Error("Not a valid Email From Validators !")
    }
    else if( !validator.isStrongPassword(password)){
        throw new Error("Password is not Strrong !!");
    }

}

module.exports = ValidateSignupData;