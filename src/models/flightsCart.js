import mongoose from "mongoose";

const flightsCartSchema = mongoose.Schema({
  id: { type: String, required: true },
  date: { type: Date },
  userEmail: { type: String, required: true, min: 3 },
  userCartFlights_ids: { type: Array },
});

const flightsCartsModel = mongoose.model("flightsCart", flightsCartSchema);

export { flightsCartsModel };
