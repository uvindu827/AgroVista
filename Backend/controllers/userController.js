import User from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
export function registerUser(req, res) {
  const data = req.body;

  data.password = bcrypt.hashSync(data.password, 10);
  //#
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
      const isPasswordCorrect = bcrypt.compareSync(
        data.password,
        user.password
      );

      if (isPasswordCorrect) {
        const token = jwt.sign(
          {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            profilePicture: user.profilePicture,
            phone: user.phone,
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

export async function updateUser(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const key = req.params.key;
    let data = req.body;

    if (data.password) {
      data.password = bcrypt.hashSync(data.password, 10);
    }

    const updatedUser = await User.findOneAndUpdate({ key: key }, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (e) {
    console.error("Error updating user:", e);
    res.status(500).json({
      message: "Failed to update user",
    });
  }
}

export async function deleteUser(req, res) {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const key = req.params.key;

    const deletedUser = await User.findOneAndDelete({ key: key });

    if (!deletedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      message: "User deleted successfully",
    });
  } catch (e) {
    console.error("Error deleting user:", e);
    res.status(500).json({
      message: "Failed to delete user",
    });
  }
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
    if (req.user.role == "inspector") {
      isAgriculturalInspector = true;
    }
  }

  return isAgriculturalInspector;
}

export function isItToolDealer(req) {
  let isToolDealer = false;

  if (req.user != null) {
    if (req.user.role == "tooldealer") {
      isToolDealer = true;
    }
  }

  return isToolDealer;
}
