// File: apps/api/controller/auth.controller.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

function validateEmail(email) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validateUsername(username) {
  // 3-20 chars, alphanumeric and underscore
  return /^[a-zA-Z0-9_]{3,20}$/.test(username);
}

function validatePassword(password) {
  // At least 8 chars, at least one letter, one number, and one special character
  return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password);
}

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Validation
  if (!validateUsername(username)) {
    return res.status(400).json({ message: "Invalid username. Use 3-20 letters, numbers, or underscores." });
  }
  if (!validateEmail(email)) {
    return res.status(400).json({ message: "Invalid email address." });
  }
  if (!validatePassword(password)) {
    return res.status(400).json({ message: "Password must be at least 8 characters, include at least one letter, one number, and one special character." });
  }

  try {
    // HASH THE PASSWORD
    const hashedPassword = await bcrypt.hash(password, 10);
    // CREATE A NEW USER AND SAVE TO DB
    const newUser = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    // Handle duplicate username/email error
    if (err.code === 'P2002' && err.meta && err.meta.target) {
      if (err.meta.target.includes('username')) {
        return res.status(400).json({ message: "Username already exists." });
      }
      if (err.meta.target.includes('email')) {
        return res.status(400).json({ message: "Email already exists." });
      }
    }
    // Generic error
    res.status(500).json({ message: "Failed to create user!" });
  }
};

export const login = async (req, res) => {
  const { username, password } = req.body;

  try {
    // CHECK IF THE USER EXISTS

    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) return res.status(400).json({ message: "Invalid Credentials!" });

    // CHECK IF THE PASSWORD IS CORRECT

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid)
      return res.status(400).json({ message: "Invalid Credentials!" });

    // GENERATE COOKIE TOKEN AND SEND TO THE USER

    // res.setHeader("Set-Cookie", "test=" + "myValue").json("success")
    const age = 1000 * 60 * 60 * 24 * 7;

    const token = jwt.sign(
      {
        id: user.id,
        isAdmin: false,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: age }
    );

    const { password: userPassword, ...userInfo } = user;

    res
      .cookie("token", token, {
        httpOnly: true,
        // secure:true,
        maxAge: age,
      })
      .status(200)
      .json(userInfo);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Failed to login!" });
  }
};

export const logout = (req, res) => {
  res.clearCookie("token").status(200).json({ message: "Logout Successful" });
};
