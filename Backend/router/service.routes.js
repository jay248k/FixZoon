import express from "express";
import {
  addService,
  updateService,
  deleteService,
  getAllServices,
  getServiceById,
  searchServices,
} from "../controllers/service.controller.js";

import fetchUser from "../middlewares/fetchUser.middleware.js";
import { isProvider } from "../middlewares/role.middleware.js";

const ServiceRouter = express.Router();

/**
 * ============================
 * PUBLIC ROUTES
 * ============================
 */

// Get all services
ServiceRouter.get("/", getAllServices);

// Get single service by ID
ServiceRouter.get("/:serviceId", getServiceById);

// Search services by area or type
// Example: /search?area=Ahmedabad&serviceType=Electrician
ServiceRouter.get("/search", searchServices);

/**
 * ============================
 * PROVIDER-PROTECTED ROUTES
 * ============================
 */

// Add new service
ServiceRouter.post("/", fetchUser, isProvider, addService);

// Update service by ID
ServiceRouter.put("/:serviceId", fetchUser, isProvider, updateService);

// Delete service by ID
ServiceRouter.delete("/:serviceId", fetchUser, isProvider, deleteService);

export default ServiceRouter;
