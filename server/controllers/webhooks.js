import { Webhook } from "svix";
import User from "../models/User.js";
// Api controller function to manage clerk user with database
export const clerkWebhooks=async(req,res)=>{
try{
const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)
await whook.verify(JSON.stringify(req.body),{
  "svix-id"  :req.headers["svix-id"],
  "svix-timestamp":req.headers["svix-timestamp"],
"svix-signature":req.headers["svix-signature"]
})
const {data,type}=req.body
switch(type){
    case 'user.created':{
const userData={
    _id:data.id,
    email:data.email_address[0].email_address,
    name:data.first_name+" "+data.last_name,
    imageUrl:data.imageUrl,
}
await User.create(userData)
res.json({})
break;
    }
        case 'user.updated':{
const userData={
    
    email:data.email_address[0].email_address,
    name:data.first_name+" "+data.last_name,
    imageUrl:data.imageUrl,
}
await User.findByIdandUpdate(data.id,userData)
res.json({})
break;
    }
        case 'user.deleted':{
await User.findByIdandDelete(data.id)
res.json({})
break;
    }
    default:break;
}
}catch(error){
res.json({success:false,message:error.message})
}
}
// a post call from the the external server that is from the paytm like app from our server thata payment is done by the user that is called the server to the server communication ==> for changing 
//  Api vs werbhook
// ------
// video link to understnad webhook https://www.youtube.com/watch?v=GND6y6lolZw   ----------
// webhook (http calback) is  like a callback (which is excecuted when a function will work or a promise is resolve or an event occur)
// payment is accepted and this reponse http call is given from server 

