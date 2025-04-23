import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import axios from "axios";
import nodemailer from "nodemailer";
import OTP from "../models/otp.js";
dotenv.config();
const transport = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: "skyrek7@gmail.com",
    pass: "newloynziggpmckm",
  },
});
export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);
  
  const newUser = new User(data);

  newUser
    .save()
    .then(() => {
      res.json({ message: "User registered successfully" });
    })
    .catch((error) => {
      res.status(500).json({ error: "User registration failed" });
    });
}

export function loginUser(req, res) {
  const data = req.body;

  User.findOne({
    email: data.email,
  }).then((user) => {
    if (user == null) {
      res.status(404).json({ error: "User not found" });
    } else {
      if (user.isBlocked) {
        res
          .status(403)
          .json({ error: "Your account is blocked please contact the admin" });
        return;
      }

      const isPasswordCorrect = bcrypt.compareSync(
        data.password,
        user.password
      );

      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            userId: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phone: user.phone,
            emailVerified: user.emailVerified,
          },
          process.env.JWT_SECRET
        );

        res.json({ message: "Login successful", token: token, user: user });
      } else {
        res.status(401).json({ error: "Login failed" });
      }
    }
  });
}

export function isItAdmin(req) {
  let isAdmin = false;

  if (req.user != null) {
    if (req.user.role == "admin") {
      isAdmin = true;
    }
  }

  return isAdmin;
}

export function isItCustomer(req) {
  let isCustomer = false;

  if (req.user != null) {
    if (req.user.role == "customer") {
      isCustomer = true;
    }
  }

  return isCustomer;
}

export function isItFarmer(req) {
  let isFarmer = false;

  if (req.user != null) {
    if (req.user.role == "farmer") {
      isFarmer = true;
    }
  }

  return isFarmer;
}

export function isItBuyer(req) {
  let isBuyer = false;

  if (req.user != null) {
    if (req.user.role == "buyer") {
      isBuyer = true;
    }
  }

  return isBuyer;
}
export function isItAgriculturalInspector(req) {
  let isAgriculturalInspector = false;

  if (req.user != null) {
    if (req.user.role == "agricultural inspector") {
      isAgriculturalInspector = true;
    }
  }

  return isAgriculturalInspector;
}
export function isItToolDealer(req) {
  let isItToolDealer = false;

  if (req.user != null) {
    if (req.user.role == "tool dealer") {
      isItToolDealer = true;
    }
  }

  return isItToolDealer;
}

export async function getAllUsers(req, res) {
  if (isItAdmin(req)) {
    try {
      const users = await User.find();
      res.json(users);
    } catch (e) {
      res.status(500).json({ error: "Failed to get users" });
    }
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
}

export async function blockOrUnblockUser(req, res) {
  const email = req.params.email;
  if (isItAdmin(req)) {
    try {
      const user = await User.findOne({
        email: email,
      });

      if (user == null) {
        res.status(404).json({ error: "User not found" });
        return;
      }

      const isBlocked = !user.isBlocked;

      await User.updateOne(
        {
          email: email,
        },
        {
          isBlocked: isBlocked,
        }
      );

      res.json({ message: "User blocked/unblocked successfully" });
    } catch (e) {
      res.status(500).json({ error: "Failed to get user" });
    }
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
}
export function getUser(req, res) {
  if (req.user != null) {
    res.json(req.user);
  } else {
    res.status(403).json({ error: "Unauthorized" });
  }
}

export async function loginWithGoogle(req, res) {
  //https://www.googleapis.com/oauth2/v3/userinfo
  const accesToken = req.body.accessToken;
  console.log(accesToken);
  try {
    const response = await axios.get(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accesToken}`,
        },
      }
    );
    console.log(response.data);
    const user = await User.findOne({
      email: response.data.email,
    });
    if (user != null) {
      const token = jwt.sign(
        {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          role: user.role,
          profilePicture: user.profilePicture,
          phone: user.phone,
          emailVerified: true,
        },
        process.env.JWT_SECRET
      );

      res.json({ message: "Login successful", token: token, user: user });
    } else {
      const newUser = new User({
        email: response.data.email,
        password: "123",
        firstName: response.data.given_name,
        lastName: response.data.family_name,
        address: "Not Given",
        phone: "Not given",
        profilePicture: response.data.picture,
        emailVerified: true,
      });
      const savedUser = await newUser.save();
      const token = jwt.sign(
        {
          firstName: savedUser.firstName,
          lastName: savedUser.lastName,
          email: savedUser.email,
          role: savedUser.role,
          profilePicture: savedUser.profilePicture,
          phone: savedUser.phone,
        },
        process.env.JWT_SECRET
      );
      res.json({ message: "Login successful", token: token, user: savedUser });
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({ error: "Failed to login with google" });
  }
}
export async function sendOTP(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  //generate number between 1000 and 9999
  const otp = Math.floor(Math.random() * 9000) + 1000;
  //save otp in database
  const newOTP = new OTP({
    email: req.user.email,
    otp: otp,
  });
  await newOTP.save();

  const message = {
    from: "skyrek7@gmail.com",
    to: req.user.email,
    subject: "Validating OTP",
    text: "Your otp code is " + otp,
  };

  transport.sendMail(message, (err, info) => {
    if (err) {
      console.log(err);
      res.status(500).json({ error: "Failed to send OTP" });
    } else {
      console.log(info);
      res.json({ message: "OTP sent successfully" });
    }
  });
}

export async function verifyOTP(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  const code = req.body.code;

  const otp = await OTP.findOne({
    email: req.user.email,
    otp: code,
  });

  if (otp == null) {
    res.status(404).json({ error: "Invalid OTP" });
    return;
  } else {
    await OTP.deleteOne({
      email: req.user.email,
      otp: code,
    });

    await User.updateOne(
      {
        email: req.user.email,
      },
      {
        emailVerified: true,
      }
    );

    res.status(200).json({ message: "Email verified successfully" });
  }
}

export async function getProfile(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json(user);
  } catch (e) {
    res.status(500).json({ error: "Failed to get profile" });
  }
}

export async function updateProfile(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  const updates = req.body;
  if (updates.password) {
    updates.password = bcrypt.hashSync(updates.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(req.user.userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (e) {
    res.status(500).json({ error: "Failed to update profile" });
  }
}

export async function deleteAccount(req, res) {
  if (req.user == null) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  try {
    await User.findByIdAndDelete(req.user.userId);
    res.json({ message: "Account deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete account" });
  }
}

export async function updateUser(req, res) {
  if (!isItAdmin(req)) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.params.id;
  const updates = req.body;
  if (updates.password) {
    updates.password = bcrypt.hashSync(updates.password, 10);
  }
  try {
    const updatedUser = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
    }).select("-password");
    if (!updatedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User updated successfully", user: updatedUser });
  } catch (e) {
    res.status(500).json({ error: "Failed to update user" });
  }
}

export async function deleteUser(req, res) {
  if (!isItAdmin(req)) {
    res.status(403).json({ error: "Unauthorized" });
    return;
  }
  const userId = req.params.id;
  try {
    const deletedUser = await User.findByIdAndDelete(userId);
    if (!deletedUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }
    res.json({ message: "User deleted successfully" });
  } catch (e) {
    res.status(500).json({ error: "Failed to delete user" });
  }
}
