import Booking from "../models/Booking.model.js";
import Service from "../models/Service.model.js";

/**
 * ============================
 * CREATE BOOKING (CUSTOMER)
 * ============================
 */
export const createBooking = async (req, res) => {
  try {
    const {
      serviceId,
      problemDescription,
      serviceAddress,
      bookingDate,
      bookingTime,
    } = req.body;

    if (
      !serviceId ||
      !problemDescription ||
      !serviceAddress ||
      !bookingDate ||
      !bookingTime
    ) {
      return res.status(400).json({
        message: "All fields are required",
      });
    }

    const service = await Service.findById(serviceId);
    if (!service || !service.isAvailable) {
      return res.status(404).json({
        message: "Service not available",
      });
    }

    const booking = await Booking.create({
      customerId: req.user.id,
      providerId: service.providerId,
      serviceId,
      problemDescription,
      serviceAddress,
      bookingDate,
      bookingTime,
    });

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET CUSTOMER BOOKINGS
 * ============================
 */
export const getCustomerBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ customerId: req.user.id })
      .populate("serviceId", "serviceName price")
      .populate("providerId", "name phone");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET PROVIDER BOOKINGS
 * ============================
 */
export const getProviderBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ providerId: req.user.id })
      .populate("serviceId", "serviceName price")
      .populate("customerId", "name phone");

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * UPDATE BOOKING STATUS (PROVIDER)
 * ============================
 */
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const allowedStatus = [
      "accepted",
      "rejected",
      "in-progress",
      "completed",
      "cancelled",
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        message: "Invalid booking status",
      });
    }

    const booking = await Booking.findOneAndUpdate(
      { _id: bookingId, providerId: req.user.id },
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
