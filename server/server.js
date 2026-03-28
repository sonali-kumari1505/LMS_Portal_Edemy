import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './configs/mongodb.js';
import { clerkWebhooks } from './controllers/webhooks.js';

dotenv.config(); // ✅ correct usage

const app = express();

// middleware
app.use(cors());

// connect DB
await connectDB();

// routes
app.get('/', (req, res) => res.send("api working"));
app.post('/clerk',express.json(),clerkWebhooks)
// port

const port = process.env.PORT || 5000;

app.listen(port, () => {
    console.log(`server is running on ${port}`);
});