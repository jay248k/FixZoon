import express from "express";
import {
  getAdminDashboard,
  getAllUsers,
  getAllProviders,
  getPendingProviders,
  approveProvider,
  toggleUserStatus,
  toggleProviderStatus,
  adminLogin,
} from "../controllers/admin.controller.js";

import fetchUser from "../middlewares/fetchUser.middleware.js";
import { isAdmin } from "../middlewares/role.middleware.js";

const AdminRouter = express.Router();

// Dashboard
AdminRouter.post("/login",adminLogin)

// AdminRouter.get("/dashboard", fetchUser, isAdmin, getAdminDashboard);
AdminRouter.get("/dashboard", getAdminDashboard);

// Users
// AdminRouter.get("/users", fetchUser, isAdmin, getAllUsers);
 AdminRouter.get("/users", getAllUsers);
// AdminRouter.put("/user/:userId/status", fetchUser, isAdmin, toggleUserStatus);
AdminRouter.put("/user/:userId/status", toggleUserStatus);

// Providers
// AdminRouter.get("/providers", fetchUser, isAdmin, getAllProviders);
AdminRouter.get("/providers", getAllProviders);
// AdminRouter.get(
//   "/providers/pending",
//   fetchUser,
//   isAdmin,
//   getPendingProviders
// );

AdminRouter.get(
  "/providers/pending",
  getPendingProviders
);

// AdminRouter.put(
//   "/provider/:providerId/approve",
//   fetchUser,
//   isAdmin,
//   approveProvider
// );

AdminRouter.put(
  "/provider/:providerId/approve",
  approveProvider
);

// AdminRouter.put(
//   "/provider/:providerId/status",
//   fetchUser,
//   isAdmin,
//   toggleProviderStatus
// );

AdminRouter.put(
  "/provider/:providerId/status",
  toggleProviderStatus
);
export default AdminRouter;
