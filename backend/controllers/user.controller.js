import UserAI from "../models/user.model.js";
import * as userService from "../services/user.service.js";
import { validationResult } from "express-validator";

import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await userService.createUser(
      req.body.email,
      req.body.password
    );

    const token = await user.generateJWT(user);

    res.cookie("token", token, { httpOnly: true });

    delete user._doc.password;

    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const loginUserController = async (req, res) => {
  const error = validationResult(req);

  if (!error.isEmpty()) {
    return res.status(400).json({ errors: error.array() });
  }

  try {
    const { email, password } = req.body;

    const user = await UserAI.findOne({ email }).select("+password");

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const isMatch = await user.comparePassword(user.password, password);

    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }
    const token = await user.generateJWT();

    delete user._doc.password;
    res.cookie("token", token, { httpOnly: true });
    res.status(200).json({ user, token });
    
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const profileController = async (req, res) => {
  //send req as json

  res.status(200).json( {user : req.user});
  
  
};

export const logoutUserController = async (req, res) => {
  try {
    const token =
      req.cookies.token || req.header("Authorization").split(" ")[1];

    redisClient.set(token, "logout", "EX", 60 * 60 * 24);

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const allUsersController = async (req, res) => {
  try {
    const loggedUser = await UserAI.findOne({ email: req.user.email });
    
    const users = await userService.allUsers({ userId: loggedUser._id });
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
