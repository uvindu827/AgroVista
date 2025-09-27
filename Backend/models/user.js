import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isBlocked: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ['buyer', 'farmer', 'tool dealer', 'agricultural inspector', 'admin',],
    required: true,
  },
  firstName: { type: String },
  lastName: { type: String },
  address: { type: String },
  phone: { type: String },
  profilePicture: { type: String, default: "default-image-url" },
  emailVerified: { type: Boolean, default: false },
  purchased: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
  registeredCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
}, { timestamps: true });

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
