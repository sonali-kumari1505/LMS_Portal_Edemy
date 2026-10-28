import { clerkClient, getAuth } from '@clerk/express'
import Course from '../models/course.js';
import { v2 as cloudinary } from 'cloudinary';
import { Purchase } from '../models/Purchase.js';
import User from '../models/User.js';

// Update user role to educator in Clerk publicMetadata
export const updateRoleToEducator = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        await clerkClient.users.updateUserMetadata(userId, {
            publicMetadata: {
                role: 'educator',
            }
        });
        res.json({ success: true, message: 'You can publish a course now' });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Add new course
export const addCourse = async (req, res) => {
    try {
        const { courseData } = req.body;
        const imageFile = req.file;
        const { userId } = getAuth(req);

        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        if (!imageFile) {
            return res.json({ success: false, message: 'Thumbnail Not Attached' });
        }

        const parsedCourseData = typeof courseData === 'string' ? JSON.parse(courseData) : courseData;
        parsedCourseData.educator = userId;

        const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
            resource_type: "image",
        });

        parsedCourseData.courseThumbnail = imageUpload.secure_url;
        const newCourse = await Course.create(parsedCourseData);

        res.json({ success: true, message: 'Course added successfully', courseId: newCourse._id });
    } catch (error) {
        console.error("addCourse error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get educator courses
export const getEducatorCourses = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const courses = await Course.find({ educator: userId });
        res.json({ success: true, courses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get Educator Dashboard Data
export const EducatorDashBoard = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const courses = await Course.find({ educator: userId });
        const totalCourses = courses.length;
        const courseIds = courses.map((course) => course._id);

        // Calculate total earnings from completed purchases
        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        });

        const totalEarnings = purchases.reduce((sum, purchase) => sum + (purchase.amount || 0), 0);

        // Collect enrolled students data with course titles and normalized imageUrl
        const enrolledStudentsData = [];
        for (const course of courses) {
            const students = await User.find(
                { _id: { $in: course.enrolledStudents } },
                'name image_url email'
            );
            students.forEach((student) => {
                enrolledStudentsData.push({
                    courseTitle: course.courseTitle,
                    student: {
                        _id: student._id,
                        name: student.name,
                        imageUrl: student.image_url || '',
                    }
                });
            });
        }

        res.json({
            success: true,
            dashboardData: {
                totalEarnings: Number(totalEarnings.toFixed(2)),
                enrolledStudentsData,
                totalCourses
            }
        });
    } catch (error) {
        console.error("EducatorDashBoard error:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get enrolled students data with purchase details
export const getEnrolledStudentsData = async (req, res) => {
    try {
        const { userId } = getAuth(req);
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const courses = await Course.find({ educator: userId });
        const courseIds = courses.map((course) => course._id);

        const purchases = await Purchase.find({
            courseId: { $in: courseIds },
            status: 'completed'
        })
            .populate('userId', 'name image_url email')
            .populate('courseId', 'courseTitle');

        const enrolledStudents = purchases
            .filter((p) => p.userId && p.courseId)
            .map((purchase) => ({
                student: {
                    _id: purchase.userId._id,
                    name: purchase.userId.name,
                    imageUrl: purchase.userId.image_url || '',
                },
                courseTitle: purchase.courseId.courseTitle,
                purchaseDate: purchase.createdAt
            }));

        res.json({ success: true, enrolledStudents });
    } catch (error) {
        console.error("getEnrolledStudentsData error:", error);
        res.json({ success: false, message: error.message });
    }
};
