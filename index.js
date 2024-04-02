import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import flightRoutes from "./src/routers/flights.js";
import flightsCartsRoutes from "./src/routers/flightsCart.js";
import "dotenv/config";

const app = express();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_CONNECTION)
  .then(() => console.log("Connected to DB"))
  .catch((err) => {
    console.log("err", err);
  });

app.use(flightRoutes);
app.use(flightsCartsRoutes);

app.use((req, res) => {
  return res.status(404).json({ status: "Endpoint does not exist" });
});

app.listen(process.env.PORT, () => {
  console.log(`Express started on http://localhost:${process.env.PORT}`);
});
