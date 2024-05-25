import { User } from "../models/UserModel";
import { asyncHandler } from "../utils/AsyncHandler";

export const SigninController = asyncHandler(async(req,res)=>{
    const {email, username, password} = req.body;

    console.log(email)

    const userCheck = User.find({email})

    if(userCheck){
        return res.status(409).json({"error":"User already exits!"});
    }

    const user = await User.create({username,email,password});

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    res.status(201).json({
        status:'success',
        data:createdUser
    })

})

// export const LoginController = asyncHandler(async(req,res)=>{
//     try {
//         const {email,username,password} = req.body;

//         if(!email || !username || !password){
//             return res.status(400).json({error:'Credentials error!'})
//         }

        

//     } catch (err) {
//         console.log(err)
//     }
// })