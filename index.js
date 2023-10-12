const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const dataRoute = require("./routes/dataRoute");
const userRoute = require("./routes/userRoute");
const categoryRoute = require("./routes/categoryRoute");
const morgan = require("morgan");
const errorHandler = require("./utils/errorHandler");

require("dotenv").config();
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);
app.use(morgan("dev"));
const port = process.env.PORT || 5000;
app.use(bodyParser.json());
app.use(cookieParser());
mongoose.set("strictQuery", false);

// Connect to the MongoDB database
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database");
  })
  .catch((error) => {
    console.error("Error connecting to the database:", error);
  });

// Define the CRUD routes
app.get("/", (req, res) => {
  res.send("Welcome to the API homepage!");
});
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Credentials", true);
  next();
});
// Create a new data model
app.use("/api/data", dataRoute);
app.use("/api/user", userRoute);
app.use("/api/category", categoryRoute);
app.all("*", (req, res) => {
  res.status(400).json({
    error: `${req.originalUrl} [${req.method}] is not found in this server`,
  });
});

app.use(errorHandler);

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
