const moongose = require("mongoose");

const UserSchema = new moongose.Schema(
    {
    first_name:String,
    last_name:String,
    email:{
        type:String,
        unique:true,
    },
    password:String,
    addresses:[
        {
            title:String,
            address1:String,
            address2:String,
            country:String,
            province:String,
            code:String,
        }
    ],
    phones:[{
        number:String,
        type:String,
    }],
    favorites:[],
    isAdmin:Boolean,
   },
   
   {
       timestamps:true,
       versionKey:false,
   }
)

module.exports = moongose.model("user",UserSchema);