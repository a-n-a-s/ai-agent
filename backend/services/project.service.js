import mongoose from "mongoose";
import ProjectModel from "../models/project.model.js";

export const createProject = async ({ name, userId }) => {
  if (!name || !userId) throw new Error("Name and userId are required");

  try {
    const project = await ProjectModel.create({ name, users: [userId] });
  } catch (err) {
    throw new Error(err.message);
  }

  return project;
};

export const getAllProjectsByUserId = async ({ userId }) => {
  if (!userId) throw new Error("userId is required");

  const allUserProjects = await ProjectModel.find({ users: userId });

  return allUserProjects;
};

export const addUsersToProject = async ({ projectId, users, userId }) => {
  if (!projectId || !users) throw new Error("projectId and users are required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid projectId");
  if (
    !Array.isArray(users) ||
    users.some((userId) => mongoose.Types.ObjectId.isValid(userId))
  )
    throw new Error("Invalid users in the array");

  if (!mongoose.Types.ObjectId.isValid(userId))
    throw new Error("Invalid userId");

  const project = await ProjectModel.findOne({ _id: projectId, users: userId });

  if (!project) throw new Error("You are not a member of this project");

  const updateProject = await ProjectModel.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { users: { $each: users } } },
    { new: true }
  );

  return updateProject;
};


export const getProjectById = async ({ projectId }) => {
  if (!projectId) throw new Error("projectId is required");

  if (!mongoose.Types.ObjectId.isValid(projectId))
    throw new Error("Invalid projectId");

  const project = await ProjectModel.findOne({
    _id: projectId,
  }).populate("users");
  return project;
};