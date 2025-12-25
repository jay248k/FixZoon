import Service from "../models/Service.model.js";

/**
 * ============================
 * ADD SERVICE (PROVIDER)
 * ============================
 */
export const addService = async (req, res) => {
  try {
    const { serviceName, description, serviceType, price, area } = req.body;

    if (!serviceName || !serviceType || !price || !area) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    const service = await Service.create({
      providerId: req.user.id,
      serviceName,
      description,
      serviceType,
      price,
      area,
    });

    res.status(201).json({
      success: true,
      message: "Service added successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * UPDATE SERVICE (PROVIDER)
 * ============================
 */
export const updateService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const updates = req.body;
    console.log(updates)
    const service = await Service.findOneAndUpdate(
      { _id: serviceId, providerId: req.user.id },
      updates,
      { new: true }
    );

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({
      success: true,
      message: "Service updated successfully",
      service,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * DELETE SERVICE (PROVIDER)
 * ============================
 */
export const deleteService = async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findOneAndDelete({
      _id: serviceId,
      providerId: req.user.id,
    });

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({
      success: true,
      message: "Service deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET ALL SERVICES (PUBLIC)
 * ============================
 */
export const getAllServices = async (req, res) => {
  try {
    const services = await Service.find({ isActive: true })
      .populate("provider", "name email phone area");

    res.status(200).json({
      success: true,
      services,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET SERVICE BY ID (PUBLIC)
 * ============================
 */
export const getServiceById = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const service = await Service.findById(serviceId)
      .populate("provider", "name email phone area");

    if (!service) return res.status(404).json({ message: "Service not found" });

    res.status(200).json({ success: true, service });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * SEARCH SERVICES BY AREA OR TYPE (PUBLIC)
 * ============================
 */

export const searchServices = async (req, res) => {
  try {
    const { serviceName, area } = req.query;

    // Service-level filter
    const serviceFilter = { isAvailable: true };

    if (serviceName) {
      serviceFilter.serviceName = {
        $regex: serviceName,
        $options: "i", // case-insensitive
      };
    }

    const services = await Service.find(serviceFilter)
      .populate({
        path: "providerId",
        select: "name email phone area",
        match: area ? { area } : {},
      });

    // Remove services whose provider didn't match area
    const filteredServices = services.filter(
      (service) => service.providerId !== null
    );

    res.status(200).json({
      success: true,
      services: filteredServices,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
