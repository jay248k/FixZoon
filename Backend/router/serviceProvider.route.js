import express from "express";
import {
  registerProvider,
  loginProvider,
  logoutProvider,
  getProviderProfile,
  updateProviderProfile,
  changeProviderPassword,
  deactivateProvider,
} from "../controllers/serviceProvider.controller.js";

import fetchUser from "../middlewares/fetchUser.middleware.js";
import { isProvider } from "../middlewares/role.middleware.js";

const ServiceProviderRouter = express.Router();

/**
 * ============================
 * PUBLIC ROUTES
 * ============================
 */
ServiceProviderRouter.post("/register", registerProvider);
ServiceProviderRouter.post("/login", loginProvider);
ServiceProviderRouter.post("/logout", logoutProvider);

/**
 * ============================
 * PROTECTED PROVIDER ROUTES
 * ============================
 */
ServiceProviderRouter.get("/profile", fetchUser, isProvider, getProviderProfile);

ServiceProviderRouter.put("/profile", fetchUser, isProvider, updateProviderProfile);

ServiceProviderRouter.put(
  "/change-password",
  fetchUser,
  isProvider,
  changeProviderPassword
);

ServiceProviderRouter.put("/deactivate", fetchUser, isProvider, deactivateProvider);

export default ServiceProviderRouter;
