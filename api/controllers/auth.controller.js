import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";

export const signup = async (req, res, next) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (password !== passwordConfirm) {
    return res.status(400).json({
      success: false,
      statusCode: 400,
      message: "Passwords don't match",
    });
  }

  const hashedPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashedPassword });

  try {
    const savedUser = await newUser.save();
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: savedUser,
    });
  } catch (err) {
    next(err);
  }
};
