import { connectDB } from "../../db/mongodb";
import Booking from "../../models/Booking";

// This route needs to run on every request (not be prerendered to static HTML),
// since it accepts form submissions and talks to the database.
export const prerender = false;

const VALID_TRIP_TYPES = new Set(["oneway", "round", "hourly"]);
const VALID_PAYMENTS = new Set(["online", "after_ride"]);

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export async function POST({ request }) {
  let payload;
  try {
    payload = await request.json();
  } catch {
    return jsonResponse({ error: "Request body must be valid JSON." }, 400);
  }

  const { pickup, dropoff, date, time, tripType, paymentPreference } =
    payload ?? {};

  // Basic server-side validation — never trust the client.
  const errors = [];
  if (!pickup || typeof pickup !== "string" || !pickup.trim()) {
    errors.push("pickup is required");
  }
  if (!dropoff || typeof dropoff !== "string" || !dropoff.trim()) {
    errors.push("dropoff is required");
  }
  if (!date || Number.isNaN(Date.parse(date))) {
    errors.push("date must be a valid date");
  }
  if (!time || !/^([01]\d|2[0-3]):[0-5]\d$/.test(time)) {
    errors.push("time must be in HH:MM 24h format");
  }
  if (tripType && !VALID_TRIP_TYPES.has(tripType)) {
    errors.push("tripType is invalid");
  }
  if (paymentPreference && !VALID_PAYMENTS.has(paymentPreference)) {
    errors.push("paymentPreference is invalid");
  }

  if (errors.length) {
    return jsonResponse({ error: "Validation failed", details: errors }, 422);
  }

  try {
    await connectDB();
    const booking = await Booking.create({
      pickup: pickup.trim(),
      dropoff: dropoff.trim(),
      date,
      time,
      tripType: tripType ?? "oneway",
      paymentPreference,
    });

    return jsonResponse(
      {
        id: booking._id,
        status: booking.status,
        message: "Booking request received.",
      },
      201
    );
  } catch (err) {
    console.error("Failed to create booking:", err);
    return jsonResponse(
      { error: "Something went wrong saving your booking. Please try again." },
      500
    );
  }
}
