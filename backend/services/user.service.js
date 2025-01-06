import UserAI from "../models/user.model.js";

export const createUser = async (email, password) => {
  if (!email || !password) throw new Error("Email and password are required");

  const hashPassword = await UserAI.hashPassword(password);

  const user = await UserAI.create({ email, password: hashPassword });
  return user;
};

export const allUsers = async ({ userId }) => {
  const users = await UserAI.find({
    _id: { $ne: userId },
  });
  return users;
};

