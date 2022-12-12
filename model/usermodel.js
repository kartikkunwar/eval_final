const mongoose=require("mongoose");

mongoose.set('strictQuery', true);

const userSchema=mongoose.Schema({
    email:String,
    password:String,
})

const Usermodel=mongoose.model("evaluser",userSchema)

module.exports={Usermodel}