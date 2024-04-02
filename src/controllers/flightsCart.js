import { flightsCartsModel } from "../models/flightsCart.js";
import { FlightModel } from "../models/flights.js";

const ADD_CART = async (req, res) => {
  try {
    const lithuanianDate = new Date().toLocaleString("lt-LT");

    const flightsCart = new flightsCartsModel({
      date: lithuanianDate,
      userEmail: req.body.userEmail,
      userCartFlights_ids: req.body.userCartFlights_ids,
    });
    flightsCart.id = flightsCart._id.toString();

    const response = await flightsCart.save();

    return res.status(201).json({ response: response });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const ADD_FLIGHT_ID_TO_CART = async (req, res) => {
  try {
    const flightId = req.body.id;

    if (!flightId) {
      return res.status(400).json({ error: "Flight ID is required" });
    }

    const flightExists = await FlightModel.exists({ id: flightId });

    if (!flightExists) {
      return res.status(404).json({ error: "Flight not found" });
    }

    const cartIdentifier = req.params.id;

    const updatedCart = await flightsCartsModel.findOneAndUpdate(
      {
        id: cartIdentifier,
      },
      { $addToSet: { userCartFlights_ids: flightId } },
      { new: true }
    );

    return res
      .status(200)
      .json({ message: "Flight added to cart", cart: updatedCart });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_ALL_CARTS = async (req, res) => {
  try {
    const flightsCarts = await flightsCartsModel
      .aggregate([
        {
          $lookup: {
            from: "flights",
            localField: "userCartFlights_ids",
            foreignField: "id",
            as: "flightsCart",
          },
        },
      ])
      .exec();

    if (!flightsCarts.length) {
      return res.status(200).json({ message: "Data not exist" });
    }

    return res.json({ flightsCarts: flightsCarts });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_CART_BY_ID = async (req, res) => {
  try {
    const findFlightsCart = await flightsCartsModel.findById(req.params.id);

    if (!findFlightsCart) {
      return res.status(404).json({
        message: `Cart with ID ${req.params.id} not found`,
      });
    }

    const flightsCartById = await flightsCartsModel
      .aggregate([
        {
          $match: {
            id: findFlightsCart.id,
          },
        },
        {
          $lookup: {
            from: "flights",
            localField: "userCartFlights_ids",
            foreignField: "id",
            as: "FlightsCartById",
          },
        },
      ])
      .exec();

    return res.json(flightsCartById[0]);
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

export { ADD_CART, ADD_FLIGHT_ID_TO_CART, GET_ALL_CARTS, GET_CART_BY_ID };
