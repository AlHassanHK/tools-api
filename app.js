//! security routes middlewares
const groceries = require("./models/ordersModel");
const express = require("express");
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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
      status: "Successfully created item.",
      data: { newGroceryItem }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = app;
