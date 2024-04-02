import { FlightModel } from "../models/flights.js";

const ADD_FLIGHT = async (req, res) => {
  try {
    const flight = new FlightModel({
      price: req.body.price,
      departureCity: req.body.departureCity,
      destinationCity: req.body.destinationCity,
      destinationCityPhotoUrl: req.body.destinationCityPhotoUrl,
      departureTime: req.body.departureTime,
    });
    flight.id = flight._id.toString();

    const response = await flight.save();

    return res.status(201).json({ response: response });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_ALL_FLIGHTS = async (req, res) => {
  try {
    const flights = await FlightModel.find();

    if (!flights.length) {
      return res.status(200).json({ message: "Data not exist" });
    }

    return res.json({ flights: flights });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const GET_FLIGHT_BY_ID = async (req, res) => {
  try {
    const findFlight = await FlightModel.findById(req.params.id);

    if (!findFlight) {
      return res.status(400).json({
        message: `The entered ID (${req.params.id}) does not exist. Please try entering a different ID.`,
      });
    }

    return res.json(findFlight);
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const DELETE_FLIGHT_BY_ID = async (req, res) => {
  try {
    const deleteFlight = await FlightModel.findByIdAndDelete(req.params.id);

    if (!deleteFlight) {
      return res
        .status(404)
        .json({ message: `Flight with ID (${req.params.id}) was not found` });
    }

    return res.status(200).json({
      message: `Flight with ID (${req.params.id}) was deleted`,
      flight: deleteFlight,
    });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const UPDATE_FLIGHT_BY_ID = async (req, res) => {
  try {
    const updateFlight = await FlightModel.findByIdAndUpdate(
      { _id: req.params.id },
      { ...req.body },
      { new: true }
    );

    if (!updateFlight) {
      return res
        .status(404)
        .json({ message: `Flight with ID (${req.params.id}) was not found` });
    }

    return res
      .status(200)
      .json({ message: "updated", updatedFlight: updateFlight });
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const PAGINATED_FLIGHTS = async (req, res) => {
  try {
    const pageNumber = Number(req.params.pageNumber);
    const pageSize = 3;

    if (!isNaN(pageNumber) && pageNumber > 0) {
      const paginatedFlights = await FlightModel.find()
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .exec();

      return res.json({ flights: paginatedFlights });
    } else {
      return res.json({
        error: `Flights list page number (${pageNumber}) is incorrect, please use a number which is greater than zero`,
      });
    }
  } catch (err) {
    console.log("HANDLED ERROR:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
};

const APP_STATUS = (req, res) => {
  const isReq = req.body;

  if (!isReq) {
    return res.json({ status: "Application is working" });
  } else {
    return res.json({ error: "Application isn't working properly" });
  }
};

export {
  ADD_FLIGHT,
  GET_ALL_FLIGHTS,
  GET_FLIGHT_BY_ID,
  DELETE_FLIGHT_BY_ID,
  UPDATE_FLIGHT_BY_ID,
  PAGINATED_FLIGHTS,
  APP_STATUS,
};
