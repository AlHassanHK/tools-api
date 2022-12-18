//! 1) connect to database and run app

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const app = require("./app");
const mongoose = require("mongoose");

const DB = process.env.DATABASE.replace("<password>", process.env.PASSWORD);
const port = process.env.PORT || 3003;
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((con) => {
    console.log("DB is connected");
    const server = app.listen(port, () => {
      console.log(`tool app is running on ${port}`);
    });
  })
  .catch((err) => console.log(err));
