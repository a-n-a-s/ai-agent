import ProjectModel from "../models/project.model.js";
import * as ProjectService from "../services/project.service.js";
import { validationResult } from "express-validator";
import UserAI from "../models/user.model.js";

export const createProjectController = async (req, res) => {
  const errors = validationResult(req);

  try {
    const { name } = req.body;

    const loggedUser = await UserAI.findOne({ email: req.user.email });
    const user_id = loggedUser._id;

    const newProject = await ProjectService.createProject({
      name,
      userId: user_id,
    });

    res.status(201).json({  newProject });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const allProjectsController = async (req, res) => {
  try {
    const loggedUser = await UserAI.findOne({ email: req.user.email });

    const allUserProjects = await ProjectService.getAllProjectsByUserId({
      userId: loggedUser._id,
    });

    res.status(200).json({ projects: allUserProjects });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const addUserToProjectController = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { projectId, users } = req.body;
    const loggedUser = await UserAI.findOne({ email: req.user.email });

    const project = await ProjectService.addUsersToProject({
      projectId,
      users,
      userId: loggedUser._id,
    });

    return res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const getProjectController = async (req, res) => {
  const { projectId } = req.params;

  try {
    const project = await ProjectService.getProjectById({ projectId });
    res.status(200).json({ project });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
