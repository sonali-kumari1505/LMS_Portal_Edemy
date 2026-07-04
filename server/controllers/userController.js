//  for get user data route controller function
import { getAuth} from '@clerk/express'
import User from '../models/User.js';
export const getUserData=async(req,res)=>{
    try{
 const {userId}=getAuth(req);
 const user=await User.findById(userId)
 if(!user){
    return res.json({success:false,message:'user Not found'})
     }
     res.json({success:true, user})
    }catch(error){
res.json({success:false,message:error.message})
    }
}