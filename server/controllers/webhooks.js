import { Webhook } from "svix";
import User from "../models/User.js";
import Stripe from 'stripe'
import { Purchase } from "../models/Purchase.js";
import Course from "../models/course.js";
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
// const userData={
//     _id:data.id,
//     email:data.email_addresses[0].email_address,
//     name:data.first_name+" "+data.last_name,
//   image_url:data.image_url,
// }
const userData = {
  _id: data.id,  // required because you defined it
  name: `${data.first_name || ""} ${data.last_name || ""}`.trim(),
  email: data.email_addresses[0]?.email_address || "",
  image_url: data.image_url || ""
};
console.log(userData)
const exist=await User.findOne({_id:data.id})
if(!exist){
await User.create(userData);
}
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

// for creatin gunction of stripe



// const stripeInstance =new Stripe(process.env.STRIPE_SECRET_KEY);
// // console.log("Stripe Key:", process.env.STRIPE_SECRET_KEY);
// export const stripeWebhooks=async(request,response)=>{
// console.log("========== STRIPE WEBHOOK CALLED ==========");

// const sig=request.headers['stripe-signature'];

//     console.log("Signature:", sig);
// let event;
// try{
// event =Stripe.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET);

// }
// catch(error){
//     response.status(400).send(`Webhook Error:${error.message}` 
//             );

// }


// // handle the event
// switch(event.type){
//     case'payment_intent.succeeded':{
//         const paymentIntent=event.data.object;
//         const paymentIntentId=paymentIntent.id;
// console.log("success is called")
//         const session =await stripeInstance.checkout.sessions.list({
//             payment_intent:paymentIntentId
//         })
//         const {purchaseId}=session.data[0].metadata;
//         const purchaseData=await Purchase.findById
//         (purchaseId)
//         const userData=await User.findById(purchaseData.userId)
//         const courseData=await Course.findById(purchaseData.courseId.toString());
// courseData.enrolledStudents.push(userData._id)
// await courseData.save()
// userData.enrolledCourses.push(courseData._id)
// await userData.save()
// purchaseData.status='completed'
// await purchaseData.save()
//         break;

//     }
//     case 'payment_intent.payment_failed':{
//                const paymentIntent=event.data.object;
//         const paymentIntentId=paymentIntent.id;
//         const sesssion =await stripeInstance.checkout.sessions.list({
//             payment_intent:paymentIntentId
//         })
//         const {purchaseId}=session.data[0].metadata;
//         if (!purchaseData) {
//     return response.status(404).send("Purchase not found");
// }
//         const purchaseData=await Purchase.finById(purchaseId)
//         purchaseData.status='failed'
//         await purchaseData.save()
//         break;}
//         //... handle other event types
//         default:{console.log(`unHandled event type ${event.type}`);
//     }
//     response.json({received:true});
// }
 

// }


const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhooks = async (request, response) => {
  console.log("========== STRIPE WEBHOOK CALLED ==========");

  const sig = request.headers["stripe-signature"];

  let event;

  try {
    event = stripeInstance.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

    console.log("Event:", event.type);
  } catch (error) {
    console.log("Webhook Error:", error.message);
    return response.status(400).send(`Webhook Error: ${error.message}`);
  }

  try {
    switch (event.type) {

      case "checkout.session.completed": {

        console.log("Payment Successful");

        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;

        console.log("Purchase ID:", purchaseId);

        const purchaseData = await Purchase.findById(purchaseId);

        if (!purchaseData) {
          console.log("Purchase not found");
          return response.status(404).send("Purchase not found");
        }

        const userData = await User.findById(purchaseData.userId);

        const courseData = await Course.findById(purchaseData.courseId);

        if (!userData || !courseData) {
          console.log("User or Course not found");
          return response.status(404).send("User/Course not found");
        }

        // Prevent duplicate enrollments
        if (!userData.enrolledCourses.includes(courseData._id)) {
          userData.enrolledCourses.push(courseData._id);
          await userData.save();
        }

        if (!courseData.enrolledStudents.includes(userData._id)) {
          courseData.enrolledStudents.push(userData._id);
          await courseData.save();
        }

        purchaseData.status = "completed";
        await purchaseData.save();

        console.log("Purchase Completed Successfully");

        break;
      }

      case "checkout.session.expired": {

        const session = event.data.object;

        const purchaseId = session.metadata.purchaseId;

        const purchaseData = await Purchase.findById(purchaseId);

        if (purchaseData) {
          purchaseData.status = "failed";
          await purchaseData.save();
        }

        console.log("Payment Failed");

        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return response.json({ received: true });

  } catch (error) {

    console.log(error);

    return response.status(500).json({
      success: false,
      message: error.message,
    });

  }
};