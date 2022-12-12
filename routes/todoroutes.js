const express=require("express");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const {Todomodel}=require("../model/todomodel")
const {Usermodel}=require("../model/usermodel")

const userRouter=express.Router();
const todoRouter=express.Router();

userRouter.get("/",async(req,res)=>{
     try{
        const alluser=await Usermodel.find()
        res.send(alluser)
     }
     catch(err){
        res.send({"msg":"invalid request"})
     }
})

userRouter.post("/signup",async(req,res)=>{
   const {email,password}=req.body;
   const ispresent=await Usermodel.findOne({email})
   if(ispresent?.email){
    res.send({"msg":"user already present"})
   }else{
        try{
            bcrypt.hash(password, 8 ,async function(err, hash) {
                const user=new Usermodel({email,password:hash})
                await user.save();
                res.send({"msg":"user added"})
            });
        }
        catch(err){
            res.send({"msg":"try again"})
            console.log(err)
        }
    }
})

userRouter.delete("/delete/:userID",async(req,res)=>{
    const userid=req.params.userID
    try{
        await Usermodel.findByIdAndDelete({_id:userid})
        res.send({"msg":"user deleted"})
    }
    catch(err){
        res.send({"msg":"try again"})
        console.log(err)
    }
})

userRouter.post("/login",async(req,res)=>{
    const {email,password}=req.body
    try{
        const user=await Usermodel.find({email})
        if(user.length>0){
            const secret=user[0].password
            bcrypt.compare(password, secret, function(err, result) {
                if(result){
                    const token = jwt.sign({ "userID": user[0]._id }, 'eval');
                    res.send({"msg":"login successful","token":token})
                }else{
                    res.send({"msg":"login failed"})
                }
            });
        }else{
            res.send({"msg":"wrong credentials"})
        }
    }
    catch(err){
        res.send({"msg":"invalid request"})
        console.log(err)
    }
})

todoRouter.get("/",async(req,res)=>{
    const userID=req.body.userID
    // const query=req.query
    // console.log(query)
    try{
       const alltodo=await Todomodel.find({userID});
       res.send(alltodo)
    }
    catch(err){
        res.send({"msg":"error loading todo"})
        console.log(err)
    }
})

todoRouter.post("/create",async(req,res)=>{
    const data=req.body;
    try{
       await Todomodel.insertMany([data])
       res.send({"msg":"todo created"})
    }
    catch(err){
        res.send({"msg":"error creating todo"})
        console.log(err)
    }
})

todoRouter.patch("/edit/:todoID",async(req,res)=>{
    const todoID=req.params.todoID
    const data=req.body
    const userID=req.body.userID
    const ourtodo=await Todomodel.findOne({_id:todoID})
    if(userID!==ourtodo?.userID){
        res.send({"msg":"not authorized"})
    }else{
        try{
           await Todomodel.findByIdAndUpdate({_id:todoID},data)
           res.send({"msg":"todo updated"})
        }
        catch(err){
            res.send({"msg":"error updating todo"})
            console.log(err)
        }
    }
})

todoRouter.delete("/delete/:todoID",async(req,res)=>{
    const todoID=req.params.todoID
    const userID=req.body.userID
    const ourtodo=await Todomodel.findOne({_id:todoID})
    if(userID!==ourtodo?.userID){
        res.send({"msg":"not authorized"})
    }else{
        try{
           await Todomodel.findByIdAndDelete({_id:todoID})
           res.send({"msg":"todo deleted successfully"})
        }
        catch(err){
            res.send({"msg":"error deleting todo"})
            console.log(err)
        }
    }
})

module.exports={userRouter,todoRouter}