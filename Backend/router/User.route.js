import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  changeUserPassword,
  deactivateUser,
} from "../controllers/user.controller.js";

import fetchUser from "../middlewares/fetchUser.middleware.js";
import { isCustomer } from "../middlewares/role.middleware.js";

const UserRouter = express.Router();

/**
 * ============================
 * PUBLIC ROUTES
 * ============================
 */
UserRouter.post("/register", registerUser);
UserRouter.post("/login", loginUser);
UserRouter.post("/logout", logoutUser);

/**
 * ============================
 * PROTECTED CUSTOMER ROUTES
 * ============================
 */
UserRouter.get("/profile", fetchUser, isCustomer, getUserProfile);

UserRouter.put("/update", fetchUser, isCustomer, updateUserProfile);

UserRouter.put(
  "/change-password",
  fetchUser,
  isCustomer,
  changeUserPassword
);

UserRouter.delete("/deactivate", fetchUser, isCustomer, deactivateUser);

export default UserRouter;
