const tools = require("./models/toolsModel");
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

app.get("/tools", async (req, res) => {
  try {
    const allTools = await tools.find();
    res.status(200).json({ data: allTools });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/createTool", async (req, res) => {
  try {
    const newTool = await tools.create(req.body);
    res.status(201).json({
      status: "Successfully created item.",
      data: { newTool }
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.patch("/:id", async (req, res) => {
  try {
    const newData = await tools.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      status: "success",
      data: newData
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err.message
    });
  }
});

app.delete("/:id"){
  async (req, res) => {
    try {
      await tools.findByIdAndDelete(req.params.id);
  
      res.status(200).json({
        status: "success",
        data: "data deleted successfully"
      });
    } catch (err) {
      res.status(404).json({
        status: "failed",
        message: err.message
      });
    }
  };
}
module.exports = app;
