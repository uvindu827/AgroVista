import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  isBlocked: {
    type: Boolean,
    required: true,
    default: false,
  },
  // new implementatio
  role: {
    type: String,
    enum: ['customer', 'buyer', 'farmer', 'tool dealer', 'agricultural inspector','admin'],
    required: true,
    //default: "customer",
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  profilePicture: {
    type: String,
    required: false,
    //default:
      //"https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg",
  },
  emailVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const User = mongoose.model("User", userSchema);

export default User;
