import mongoose from "mongoose";

const flightSchema = mongoose.Schema({
  price: { type: Number, required: true },
  departureCity: { type: String, required: true, min: 3 },
  destinationCity: { type: String, required: true, min: 3 },
  destinationCityPhotoUrl: { type: String, required: true, min: 3 },
  departureTime: { type: String, required: true, min: 3 },
});

const FlightModel = mongoose.model("flight", flightSchema);

export { FlightModel };
