import { Webhook } from "svix";
import User from "../models/User.js";
// Api controller function to manage clerk user with database
export const clerkWebhooks=async(req,res)=>{
    // api controller function and it handles webhooks requests
    
try{
const whook=new Webhook(process.env.CLERK_WEBHOOK_SECRET)
await whook.verify(JSON.stringify(req.body),{ //it verify that request is automatically coming from clerk
  "svix-id"  :req.headers["svix-id"], 
  "svix-timestamp":req.headers["svix-timestamp"],
"svix-signature":req.headers["svix-signature"]
})
console.log("webhook received",req.body);
const {data,type}=req.body
switch(type){
    case 'user.created':{
const userData={
    _id:data.id,
    email:data.email_addresses[0].email_address,
    name:data.first_name+" "+data.last_name,
  image_url:data.image_url,
}
// const userData = {
//   _id: data.id,  // required because you defined it
//   name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
//   email: data.email_addresses[0]?.email_address || "",
//   image_url: data.image_url || ""
// };
console.log(userData)
// const exist=await User.findOne({_id:data.id})
// if(!exist){
await User.create(userData);
// }
res.json({})
break;
    }
        case 'user.updated':{
const userData={
    
    email:data.email_addresses[0].email_address,
    name:data.first_name+" "+data.last_name,
    image_url:data.image_url,
}
await User.findByIdAndUpdate(data.id,userData)
res.json({})
break;
    }
        case 'user.deleted':{
await User.findByIdAndDelete(data.id)
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

