import bcrypt from "bcryptjs";
import User from "../models/user.model.js";
import { errorHandler } from "../utils/error.js";

export const test = (req, res) => {
  res.send("Api route is working!");
};

export const updateUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(false, 401, "Unauthorized"));
  }

  try {
    if (req.body.password && req.body.password !== req.body.passwordConfirm) {
      return next(errorHandler(false, 400, "Passwords do not match"));
    }

    if (req.body.password) {
      req.body.password = bcrypt.hashSync(req.body.password, 10);
      req.body.passwordConfirm = req.body.password;
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          username: req.body.username,
          email: req.body.email,
          password: req.body.password,
          avatar: req.body.avatar,
        },
      },
      { new: true }
    );

    if (!updatedUser) {
      return next(errorHandler(false, 404, "User not found"));
    }

    const { password, ...rest } = updatedUser._doc;
    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: rest,
    });
  } catch (err) {
    return next(errorHandler(false, 500, "Internal Server Error"));
  }
};

export const deleteUser = async (req, res, next) => {
  if (req.user.id !== req.params.id) {
    return next(errorHandler(false, 401, "Unauthorized"));
  }

  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser) {
      return next(errorHandler(false, 404, "User not found"));
    }

    res.clearCookie("access_token");
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    return next(errorHandler(false, 500, "Internal Server Error"));
  }
};
