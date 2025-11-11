import Course from '../models/Coursemodel.js';

// Suggest courses with low purchases/registrations (threshold = 3)
export const getLowPurchaseCourses = async (req, res) => {
  try {
    // You can adjust the threshold as needed
    const threshold = 3;
    // Find courses with registeredUsers count less than threshold
    const lowCourses = await Course.find({ deleted: false })
      .populate('coordinator', 'name email')
      .lean();
    const result = lowCourses
      .map(course => ({
        ...course,
        registeredCount: course.registeredUsers ? course.registeredUsers.length : 0
      }))
      .filter(course => course.registeredCount < threshold);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
