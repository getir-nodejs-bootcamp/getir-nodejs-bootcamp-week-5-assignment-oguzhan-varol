const User = require("../models/User")


const list = () =>{
    return User.find({});
}

const insert = (data) =>{
    return new User(data).save();
    
}

const loginUser = (loginData) =>{
    return User.findOne(loginData);
}

const modify = (where,data) =>{
    return User.findOneAndUpdate(where,data,{new:true})


}





module.exports={
    list,
    insert,
    loginUser,
    modify,
}