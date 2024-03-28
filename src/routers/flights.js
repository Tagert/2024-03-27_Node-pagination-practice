import express from "express";

import {
  ADD_FLIGHT,
  GET_ALL_FLIGHTS,
  GET_FLIGHT_BY_ID,
  DELETE_FLIGHT_BY_ID,
  UPDATE_FLIGHT_BY_ID,
  PAGINATED_FLIGHTS,
  APP_STATUS,
} from "../controllers/flights.js";

const router = express.Router();

router.post("/flights", ADD_FLIGHT);

router.get("/flights", GET_ALL_FLIGHTS);

router.get("/flights/:id", GET_FLIGHT_BY_ID);

router.delete("/flights/:id", DELETE_FLIGHT_BY_ID);

router.put("/flights/:id", UPDATE_FLIGHT_BY_ID);

router.get("/flights/page/:pageNumber", PAGINATED_FLIGHTS);

router.get("/status", APP_STATUS);

export default router;
