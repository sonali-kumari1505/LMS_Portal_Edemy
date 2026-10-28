import Course from '../models/course.js';

// Get all published courses
export const getAllCourse = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true })
            .select(['-courseContent', '-enrolledStudents'])
            .populate({ path: 'educator' });

        res.json({ success: true, courses });
    } catch (error) {
        console.error("Error from getAllCourse:", error);
        res.json({ success: false, message: error.message });
    }
};

// Get course by ID
export const getCourseId = async (req, res) => {
    const { id } = req.params;
    try {
        const courseData = await Course.findById(id).populate({ path: 'educator' });

        if (!courseData) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Remove lectureUrl if isPreviewFree is false (protect paid lectures)
        if (Array.isArray(courseData.courseContent)) {
            courseData.courseContent.forEach((chapter) => {
                if (Array.isArray(chapter.chapterContent)) {
                    chapter.chapterContent.forEach((lecture) => {
                        if (!lecture.isPreviewFree) {
                            lecture.lectureUrl = "";
                        }
                    });
                }
            });
        }

        res.json({ success: true, courseData });
    } catch (error) {
        console.error("Error from getCourseId:", error);
        res.json({ success: false, message: error.message });
    }
};
