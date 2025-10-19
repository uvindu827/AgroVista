import mongoose from "mongoose";
const schema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
});
export default mongoose.model("UserRegisteredCourse", schema);
