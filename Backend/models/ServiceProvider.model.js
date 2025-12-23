import mongoose from "mongoose";

const serviceProviderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    phone: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["provider"],
      default: "provider",
    },

    areas: [
      {
        type: String,
        required: true,
      },
    ],

    experience: {
      type: Number, // years
    },

    description: {
      type: String,
    },

    servicesOffered: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Service",
      },
    ],

    availability: {
      days: [String], // ["Mon", "Tue"]
      time: String, // "10AM - 7PM"
    },

    rating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceProvider", serviceProviderSchema);
