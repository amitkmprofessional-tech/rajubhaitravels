import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    tripType: {
      type: String,
      enum: ["oneway", "round", "hourly"],
      default: "oneway",
    },
    pickup: { type: String, required: true, trim: true, maxlength: 200 },
    dropoff: { type: String, required: true, trim: true, maxlength: 200 },
    date: { type: String, required: true }, // ISO date string, e.g. 2026-07-20
    time: { type: String, required: true }, // 24h time string, e.g. 14:30
    paymentPreference: {
      type: String,
      enum: ["online", "after_ride"],
    },
    status: {
      type: String,
      enum: ["requested", "confirmed", "cancelled", "completed"],
      default: "requested",
    },
    // Optional contact details for future use (not yet collected by the form)
    name: { type: String, trim: true, maxlength: 120 },
    phone: { type: String, trim: true, maxlength: 20 },
  },
  { timestamps: true }
);

// Avoid model overwrite errors on hot-reload in dev.
export default mongoose.models.Booking ||
  mongoose.model("Booking", bookingSchema);
