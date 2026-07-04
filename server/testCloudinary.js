import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY,
});

try {
  const result = await cloudinary.uploader.upload(
    "course_1.png",
    {
      resource_type: "image",
    }
  );

  console.log(result);
} catch (err) {
  console.log("Status:", err.http_code);
  console.log("Message:", err.message);
  console.dir(err, { depth: null });

  if (err.error) {
    console.log("Cloudinary Error:", err.error);
  }

  if (err.response?.body) {
    console.log(err.response.body);
  }
}