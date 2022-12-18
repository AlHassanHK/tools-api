//! security routes middlewares
const groceries = require("./models/ordersModel");
const express = require("express");
const app = express();
//! 1)security

//CORS handler
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Methods", "PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
  }
  next();
});

app.get("/groceries", async (req, res) => {
  try {
    const allGroceries = await groceries.find();
    res.status(200).json({ data: allGroceries });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/createGroceryItem", async (req, res) => {
  try {
    const newGroceryItem = await groceries.create(req.body);
    res.status(201).json({
      status: "Successfully created order.",
      data: { newOrder }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

// async (req, res) => {
//   //won't take status, check that item exists and is in stock in the other service
//   try {
//     const newOrder = await orders.create(req.body);
//     res.status(201).json({
//       status: "Successfully created order.",
//       data: { newOrder },
//     });
//   } catch (error) {
//     res.status(400).json({
//       status: "Bad request.",
//       data: {},
//     });
//   }
// };

//! 2) middlewares
//? body paser, for reading data from the body
app.use(express.json());
//? to pass data coming from URL encoded form
app.use(express.urlencoded({ extended: true }));

module.exports = app;
