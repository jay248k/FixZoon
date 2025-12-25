import express from "express";
import {
  createBooking,
  getCustomerBookings,
  getProviderBookings,
  updateBookingStatus,
} from "../controllers/booking.controller.js";

import fetchUser from "../middlewares/fetchUser.middleware.js";
import { isCustomer, isProvider } from "../middlewares/role.middleware.js";

const BookRouter = express.Router();

/**
 * ============================
 * CUSTOMER ROUTES
 * ============================
 */
BookRouter.post("/", fetchUser, isCustomer, createBooking);
BookRouter.get("/customer", fetchUser, isCustomer, getCustomerBookings);

/**
 * ============================
 * PROVIDER ROUTES
 * ============================
 */
BookRouter.get("/provider", fetchUser, isProvider, getProviderBookings);
BookRouter.put("/:bookingId/status", fetchUser, isProvider, updateBookingStatus);

export default BookRouter;
