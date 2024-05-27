import { User } from "../models/UserModel.js";
import { asyncHandler } from "../utils/AsyncHandler.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById({ userId });
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (err) {
    console.log(err);
  }
};

export const SigninController = async (req, res) => {
  const { email, username, password } = req.body;


  try {
    const userCheck = await User.find({ email: email });

    if (!userCheck) {
      return res.status(409).json({ error: "User already exits!" });
    }

    const user = await User.create({ username, email, password });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    res.status(201).json({
      status: "success",
      data: createdUser,
    });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured!" });
  }
};

export const LoginController = asyncHandler(async (req, res) => {
  try {
    const { email, username, password } = req.body;

    if (!email && !username) {
      return res.status(400).json({ error: "Credentials error!" });
    }

    const user = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (!user) {
      return res.status(404).json({ error: "User not registered!" });
    }

    const isPassCorrectValid = await user.isPasswordCorrect(password);

    if (!isPassCorrectValid) {
      return res.status(401).json({ error: "Password invalid!" });
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    const loggedInUser = {
      _id: user._id,
      username: user.username,
      email: user.email,
    };

    // TO make cookie modifiable by server only we use following code
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        user: loggedInUser,
        accessToken,
        refreshToken,
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured!" });
  }
});

export const LogoutController = asyncHandler(async (res, req) => {
  const id = req.user._id;

  await User.findByIdAndUpdate(id, {
    $set: {
      refreshToken: undefined,
    },
  });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json({ message: "User logged out!" });
});

export const refreshAccessTokenController = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  try {
    if (!incomingRefreshToken)
      return res.status(401).json({ message: "Unauthorized request!" });

    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select("-password");

    if (!user)
      return res.status(401).json({ message: "Invalid refresh token!" });

    if (incomingRefreshToken !== user?.refreshToken)
      return res.status(401).json({ message: "Refresh token expired!" });

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
      user._id
    );

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", refreshToken, options)
      .json({
        accessToken,
        refreshToken,
        message: "Access Token refreshed!",
      });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Error occured!" });
  }
});
