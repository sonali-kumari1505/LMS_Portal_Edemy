# 🎓 Edemy — Full-Stack Learning Management System (LMS)

A modern, full-stack Learning Management System (LMS) built with **React**, **Node.js**, **Express**, and **MongoDB**. The platform empowers educators to publish and monetize courses while giving students an interactive learning environment with progress tracking, video lectures, and secure Stripe checkout.

---

## 📌 About the Project

Online education often faces hurdles with fragmented tools: separate platforms for video streaming, payment processing, enrollment tracking, and instructor analytics. 

**Edemy LMS** solves this by providing a unified, end-to-end educational ecosystem. 
- **For Students:** It offers an intuitive interface to discover courses, preview free lectures, securely purchase courses via Stripe, and track their learning progress lecture-by-lecture.
- **For Educators:** It provides a comprehensive dashboard to upload rich multimedia courses, manage chapters and lectures, monitor student enrollments, and track course revenue in real time.

It is useful in real life for universities, coaching institutes, individual content creators, and corporate training programs looking to host and monetize digital courses seamlessly.

---

## 🎯 Objectives

- **Solve Real-World EdTech Challenges:** Deliver a frictionless learning portal combining authentication, media management, course authoring, and billing.
- **Implement Robust Role-Based Access Control:** Differentiate educator and student permissions cleanly using Clerk Authentication.
- **Deliver Smooth Course Progression:** Automatically track lecture completion percentages and persist user progress in MongoDB.
- **Ensure Secure Monetary Transactions:** Seamlessly process international course purchases with Stripe Checkout and automated webhook reconciliation.
- **Build a Responsive, Modern User Experience:** Leverage Tailwind CSS and React for fast, mobile-friendly navigation and Quill for rich-text descriptions.

---

## ✨ Features

### 👨‍🎓 For Students
- **Course Discovery & Search:** Browse published courses with search filters, category tags, ratings, and pricing discounts.
- **Interactive Course Details:** Preview course syllabi, chapter breakdowns, educator profiles, and watch free preview lectures before purchasing.
- **Secure Stripe Checkout:** Fast, one-click checkout supporting card payments with automated enrollment confirmation.
- **Dedicated Learning Player:** Distraction-free video player powered by YouTube integration, chapter sidebar, and lecture status indicators.
- **Progress Tracking:** Real-time progress bar calculation (`rc-progress`) reflecting completed vs. remaining lectures.
- **My Enrollments Hub:** Central dashboard listing enrolled courses with completion percentages and ratings.

### 👩‍🏫 For Educators
- **Educator Dashboard:** Real-time metrics overview displaying total earnings, enrolled students count, and active courses.
- **Comprehensive Course Creator:**
  - Multi-chapter and multi-lecture curriculum builder.
  - Video lecture links with duration and "Free Preview" toggle options.
  - Rich-text course descriptions powered by the Quill editor.
  - Thumbnail image uploads handled through Cloudinary CDN.
- **Student Enrollment Monitoring:** View registered student lists, purchase timestamps, and enrollment status.

### 🔐 System & Security Architecture
- **Clerk Authentication:** Secure sign-up, sign-in, session management, and OAuth integration.
- **Webhook Synchronizations:** Svix-verified webhooks for instant Clerk user sync and Stripe payment updates.
- **Protected Routes:** Middleware guards preventing unauthorized access to educator and player routes.

---

## 🛠️ Technologies Used

- **Frontend:**
  - **Framework:** React 19 (Vite)
  - **Styling:** Tailwind CSS (v4)
  - **Routing:** React Router DOM (v7)
  - **Authentication:** `@clerk/react`
  - **Video Player:** `react-youtube`
  - **Rich Text Editor:** Quill
  - **UI Notifications & Progress:** `react-toastify`, `rc-progress`, `humanize-duration`
  - **HTTP Client:** Axios

- **Backend:**
  - **Runtime Environment:** Node.js (ES Modules)
  - **Server Framework:** Express.js 5
  - **Database & ODM:** MongoDB Atlas with Mongoose
  - **Authentication Middleware:** `@clerk/express`
  - **Payment Gateway:** Stripe API
  - **File Storage & CDN:** Cloudinary with Multer
  - **Webhook Verification:** Svix
  - **Environment Configuration:** Dotenv

- **Tools & Platforms:**
  - **Development:** VS Code, Git, Postman
  - **Database Management:** MongoDB Compass / Atlas Web Portal
  - **Media Hosting:** Cloudinary Console

---

## ⚙️ Installation and Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [MongoDB Atlas](https://www.mongodb.com/atlas) account
- [Clerk](https://clerk.com/) account
- [Cloudinary](https://cloudinary.com/) account
- [Stripe](https://stripe.com/) account

---

### Step-by-Step Setup

#### 1. Clone the repository
```bash
git clone https://github.com/your-username/LMS.git
cd LMS
```

#### 2. Backend Setup
1. Open a terminal and navigate to the `server` folder:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `server` directory and add the following keys:
   ```env
   PORT=5000
   CURRENCY=USD
   MONGODB_URI=your_mongodb_connection_string

   CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key
   CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

   CLOUDINARY_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_SECRET_KEY=your_cloudinary_api_secret

   STRIPE_SECRET_KEY=your_stripe_secret_key
   STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
   STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   ```
4. Start the backend development server:
   ```bash
   npm run server
   ```
   *The backend will run on `http://localhost:5000` and connect to MongoDB.*

---

#### 3. Frontend Setup
1. Open a new terminal and navigate to the `client` folder:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the `client` directory:
   ```env
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_BACKEND_URL=http://localhost:5000
   VITE_CURRENCY=$
   ```
4. Start the frontend application:
   ```bash
   npm run dev
   ```
   *The client will open locally at `http://localhost:5173`.*

---

## 📂 Project Structure

```text
LMS/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets and icons
│   └── src/
│       ├── assets/             # Images, vector logos, and static data
│       ├── components/
│       │   ├── educator/       # Educator components (Navbar, Sidebar, Footer)
│       │   └── student/        # Student components (Hero, CourseCard, Rating, etc.)
│       ├── context/            # Global AppContext state (courses, user data, enrollments)
│       ├── pages/
│       │   ├── educator/       # Dashboard, AddCourse, MyCourses, StudentsEnrolled
│       │   └── student/        # Home, CoursesList, CourseDetails, Player, MyEnrollments
│       ├── App.jsx             # Main routing and layout configuration
│       ├── main.jsx            # Entry point with Clerk & AppContextProvider
│       └── index.css           # Tailwind CSS imports and custom styles
│
├── server/                     # Backend API (Node.js + Express)
│   ├── configs/                # MongoDB, Cloudinary, and Multer configurations
│   ├── controllers/            # Route business logic (course, educator, user, webhooks)
│   ├── middleware/             # Role authorization and Clerk token protection
│   ├── models/                 # Mongoose schemas (User, Course, Purchase, CourseProgress)
│   ├── routes/                 # API endpoint routers (courseRoute, educatorRoutes, userRoutes)
│   ├── server.js               # Express application entry point & webhook handling
│   └── vercel.json             # Deployment configuration
│
└── README.md                   # Project documentation
```

---

## 📊 Results

- **High-Performance Course Delivery:** Fast page loading times utilizing Vite build tools and Cloudinary asset delivery.
- **Robust End-to-End Workflow:** Successfully verified user registration, course creation with multi-chapter video playlists, checkout redirection through Stripe, and database state updates via webhooks.
- **Intuitive UI/UX:** Clean, student-first user interface with smooth transitions, responsive mobile viewports, and informative toast feedback for API operations.

---

## 🚀 Future Improvements

- **AI-Powered Learning Assistant:** Integrate an AI chatbot to answer student questions based on lecture transcripts.
- **Certificate Generation:** Automatically issue downloadable PDF certificates upon 100% course completion.
- **Direct Video Uploads:** Support native video uploading with HLS/DASH adaptive bitrate streaming alongside YouTube links.
- **Quizzes & Assignments:** Add interactive quiz modules at the end of each chapter with automated grading.
- **Discussion Forums:** Create lecture-specific discussion boards for peer-to-peer and educator interactions.

---

## 👩‍💻 Author

**Sonali Kumari**  
- GitHub: [@sonalisinghrajput1498](https://github.com)  
- Email: sonalisinghraj1498@gmail.com
