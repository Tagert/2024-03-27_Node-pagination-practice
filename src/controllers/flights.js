import { FlightModel } from "../models/flights.js";

let flightsList = [];

const ADD_FLIGHT = async (req, res) => {
  try {
    const flight = new FlightModel({
      price: req.body.price,
      departureCity: req.body.departureCity,
      destinationCity: req.body.destinationCity,
      destinationCityPhotoUrl: req.body.destinationCityPhotoUrl,
      departureTime: req.body.departureTime,
    });

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

const GET_FLIGHT_BY_ID = (req, res) => {
  const findFlight = flightsList.find((f) => f.id === req.params.id);

  if (!findFlight) {
    return res.status(400).json({
      message: `The entered ID (${req.params.id}) does not exist. Please try entering a different ID.`,
    });
  }

  return res.json(findFlight);
};

const DELETE_FLIGHT_BY_ID = (req, res) => {
  const remainingFlight = flightsList.filter((f) => {
    return req.params.id !== f.id;
  });

  const isFlightExists = flightsList.some((f) => f.id === req.params.id);

  if (!isFlightExists) {
    return res
      .status(404)
      .json({ message: `Flight with ID (${req.params.id}) was not found` });
  }

  flightsList = remainingFlight;

  return res
    .status(200)
    .json({ message: `Flight with ID (${req.params.id}) was deleted` });
};

const UPDATE_FLIGHT_BY_ID = (req, res) => {
  const isFlightExists = flightsList.some((f) => f.id === req.params.id);

  if (!isFlightExists) {
    return res
      .status(404)
      .json({ message: `Flight with ID (${req.params.id}) was not found` });
  }

  const index = flightsList.findIndex((f) => f.id === req.params.id);

  flightsList[index] = { ...flightsList[index], ...req.body };

  return res.json({ updatedFlight: flightsList[index] });
};

const PAGINATED_FLIGHTS = (req, res) => {
  const pageNumber = Number(req.params.pageNumber);
  const pageSize = 5;

  if (!flightsList.length) {
    return res.status(200).json({ message: "Data not exist" });
  }

  if (typeof pageNumber === "number" && pageNumber > 0) {
    const startingPoint = (pageNumber - 1) * pageSize;
    const paginatedFlights = flightsList.slice(
      startingPoint,
      startingPoint + pageSize
    );

    return res.json({ flights: paginatedFlights });
  } else {
    return res.json({
      error: `Flights list page number (${pageNumber}) is incorrect, it must be a number and not a 0`,
    });
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
