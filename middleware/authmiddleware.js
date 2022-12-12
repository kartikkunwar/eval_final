const jwt=require("jsonwebtoken");

const authmiddleware=(req,res,next)=>{
    const token=req.headers?.authorization?.split(" ")[1];
    if(token){
        const decoded=jwt.verify(token, 'eval')
        if(decoded){
            const userID=decoded.userID
            req.body.userID=userID
            next();
        }else{
            res.send({"msg":"please login"})
        }
    }else{
        res.send({"msg":"please login"})
    }
}

module.exports={authmiddleware};