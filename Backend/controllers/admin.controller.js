import User from "../models/User.model.js";
import ServiceProvider from "../models/ServiceProvider.model.js";


export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await User.findOne({ email, role: "admin" }).select("+password");

    if (!admin || !admin.isActive) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      { id: admin._id, role: "admin" },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Admin login successful",
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/**
 * ============================
 * GET ADMIN DASHBOARD STATS
 * ============================
 */
export const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalProviders = await ServiceProvider.countDocuments();
    const pendingProviders = await ServiceProvider.countDocuments({
      isApproved: false,
    });

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalProviders,
        pendingProviders,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET ALL USERS
 * ============================
 */
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET ALL SERVICE PROVIDERS
 * ============================
 */
export const getAllProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find().select("-password");

    res.status(200).json({
      success: true,
      providers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * GET PENDING PROVIDERS
 * ============================
 */
export const getPendingProviders = async (req, res) => {
  try {
    const providers = await ServiceProvider.find({
      isApproved: false,
    }).select("-password");

    res.status(200).json({
      success: true,
      providers,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * APPROVE SERVICE PROVIDER
 * ============================
 */
export const approveProvider = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await ServiceProvider.findByIdAndUpdate(
      providerId,
      { isApproved: true },
      { new: true }
    ).select("-password");

    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    res.status(200).json({
      success: true,
      message: "Provider approved successfully",
      provider,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * BLOCK / UNBLOCK USER
 * ============================
 */
export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "blocked"} successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/**
 * ============================
 * BLOCK / UNBLOCK PROVIDER
 * ============================
 */
export const toggleProviderStatus = async (req, res) => {
  try {
    const { providerId } = req.params;

    const provider = await ServiceProvider.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    provider.isActive = !provider.isActive;
    await provider.save();

    res.status(200).json({
      success: true,
      message: `Provider ${
        provider.isActive ? "activated" : "blocked"
      } successfully`,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
