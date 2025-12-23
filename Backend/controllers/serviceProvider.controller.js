import ServiceProvider from "../models/ServiceProvider.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

/**
 * ============================
 * REGISTER SERVICE PROVIDER
 * ============================
 */
export const registerProvider = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
      serviceType,
      area,
      address,
    } = req.body;

    if (!name || !email || !phone || !password || !serviceType || !area) {
      return res.status(400).json({ message: "All fields required" });
    }

    const existing = await ServiceProvider.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Provider already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await ServiceProvider.create({
      name,
      email,
      phone,
      password: hashedPassword,
      serviceType,
      area,
      address,
      isApproved: false, // Admin approval required
    });

    res.status(201).json({
      success: true,
      message: "Registration successful. Waiting for admin approval",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * LOGIN PROVIDER
 * ============================
 */
export const loginProvider = async (req, res) => {
  try {
    const { email, password } = req.body;

    const provider = await ServiceProvider.findOne({ email }).select("+password");

    if (!provider || !provider.isActive) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    if (!provider.isApproved) {
      return res.status(403).json({
        message: "Account not approved by admin",
      });
    }

    const isMatch = await bcrypt.compare(password, provider.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: provider._id, role: "provider" },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      provider: {
        id: provider._id,
        name: provider.name,
        serviceType: provider.serviceType,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * LOGOUT PROVIDER
 * ============================
 */
export const logoutProvider = (req, res) => {
  res.clearCookie("token");

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

/**
 * ============================
 * GET PROVIDER PROFILE
 * ============================
 */
export const getProviderProfile = async (req, res) => {
  try {
    const provider = await ServiceProvider.findById(req.user.id).select(
      "-password"
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({
      success: true,
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * UPDATE PROVIDER PROFILE
 * ============================
 */
export const updateProviderProfile = async (req, res) => {
  try {
    const { name, phone, area, address, serviceType } = req.body;

    const provider = await ServiceProvider.findByIdAndUpdate(
      req.user.id,
      { name, phone, area, address, serviceType },
      { new: true }
    ).select("-password");

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * CHANGE PROVIDER PASSWORD
 * ============================
 */
export const changeProviderPassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const provider = await ServiceProvider.findById(req.user.id).select(
      "+password"
    );

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    const isMatch = await bcrypt.compare(oldPassword, provider.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password incorrect" });
    }

    provider.password = await bcrypt.hash(newPassword, 10);
    await provider.save();

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * DEACTIVATE PROVIDER
 * ============================
 */
export const deactivateProvider = async (req, res) => {
  try {
    await ServiceProvider.findByIdAndUpdate(req.user.id, { isActive: false });

    res.clearCookie("token");

    res.status(200).json({
      success: true,
      message: "Account deactivated",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
