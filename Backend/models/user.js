import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
    default: "customer",
  },
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
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
    required: true,
    default:
      "https://img.freepik.com/free-psd/contact-icon-illustration-isolated_23-2151903337.jpg?t=st=1737020897~exp=1737024497~hmac=dbfa34d34e8727f17588ef829039ae4df14d88f388a0c520997a0fe7ea2b20cf&w=740",
  },
});

const User = mongoose.model("User", userSchema);

export default User;
