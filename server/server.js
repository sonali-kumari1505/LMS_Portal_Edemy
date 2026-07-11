import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks, stripeWebhooks } from './controllers/webhooks.js';
import educatorRouter from './routes/educatorRoutes.js';
import { clerkMiddleware } from '@clerk/express';
import connectCloudinary from './configs/cloudinary.js';
import courseRouter from './routes/courseRoute.js';
import userRouter from './routes/userRoutes.js';

// dotenv.config(); // ✅ correct usage

const app = express();

// middleware
app.use(cors());
app.use(clerkMiddleware())  // add the auth property 
// connect DB
await connectDB();
await connectCloudinary();
// routes
app.get('/', (req, res) => res.send("api working"));
app.post('/clerk',express.json(),clerkWebhooks)
app.use('/api/educator',express.json(),educatorRouter)
app.use('/api/course',express.json(),courseRouter)
app.use('/api/user',express.json(),userRouter)
app.post('/Stripe',express.raw({type:`application/json`}), stripeWebhooks)
// port
const port = process.env.PORT || 5000;
// const port=5000
app.listen(port, () => {
    console.log(`server is running on ${port}`);
});