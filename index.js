const express = require("express");
const mongoose = require("mongoose");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const cors = require("cors");
require("dotenv").config();

const userRoute = require("./routes/user.route");
const swaggerOptions = require("./swagger.options");

const port = process.env.PORT || 8080;
const mongoUrl = process.env.MONGO_URL || "mongodb://127.0.0.1/dev";

const specs = swaggerJsdoc(swaggerOptions);

const app = express();

app.use(cors());
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());

app.use("/api/user", userRoute);

app.listen(port, async () => {
  try {
    await mongoose.connect(mongoUrl);
    console.log("Database connected successfully");
    console.log(`Server up and running on port ${port}`);
  } catch (err) {
    console.log(err);
  }
});

module.exports = app;
