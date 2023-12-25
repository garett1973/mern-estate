import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { errorHandler } from "../utils/error.js";

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

export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  console.log("signin", req.body);
  try {
    const validUser = await User.findOne({ email });
    console.log("validUser");
    if (!validUser) {
      return next(errorHandler(false, 400, "Invalid credentials"));
    }

    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(false, 400, "Invalid credentials"));
    }

    const token = jwt.sign(
      { id: validUser._id, username: validUser.username },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    const { password: userPassword, ...rest } = validUser._doc;
    res
      .cookie("access_token", token, {
        httpOnly: true,
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
      })
      .status(200)
      .json({
        success: true,
        message: "User logged in successfully",
        user: rest,
      });
  } catch (err) {
    console.log("catch", err);
    next(err);
  }
};
