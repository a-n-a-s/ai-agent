import { Router } from "express";
import * as ProjectController from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post(
  "/create",
  authUser,
  body("name").not().isEmpty().withMessage("Name is required"),
  ProjectController.createProjectController
);

router.get("/all", authUser, ProjectController.allProjectsController);

router.put(
  "/add-user",
  authUser,
  body("projectId").isString().withMessage("projectId is required"),
  body("users")
    .isArray({ min: 1 })
    .withMessage("users  must array")
    .bail()
    .custom((users) => users.every((user) => typeof user === "string"))
    .withMessage("user must be a string"),
  ProjectController.addUserToProjectController
);


router.get('/get-project/:projectId' , authUser, ProjectController.getProjectController);

export default router;
