const mongoose=require("mongoose");

mongoose.set('strictQuery', true);

const todoSchema=mongoose.Schema({
    taskname:String,
    status:String,
    tag:String,
    userID:String
})

const Todomodel=mongoose.model("evaltodo",todoSchema)

module.exports={Todomodel}