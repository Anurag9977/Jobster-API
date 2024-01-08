//Dependencies
const express = require("express");
require("dotenv").config();
require("express-async-errors");

//Extra security packages
const helmet = require("helmet");
const cors = require("cors");
const xssClean = require("xss-clean");
const { rateLimit } = require("express-rate-limit");

//Middleware files
const notFound = require("./middlewares/notFound");
const errorHandlerMiddleware = require("./middlewares/errorHandler");
const authMiddleware = require("./middlewares/auth");

//Route files
const jobRoutes = require("./routes/jobs");
const authRoutes = require("./routes/auth");

//Database connection file
const connectToDB = require("./db/connect");

//Invoke Express App
const app = express();

//Add Middlewares

//JSON, HELMET, CORS, XSS-CLEAN & EXPRESS-RATE-LIMIT
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xssClean());
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100,
  })
);

//App Default Route
app.use(express.static("../Client"));
//Routes
app.use("/api/v1/jobs", authMiddleware, jobRoutes);
app.use("/api/v1/auth", authRoutes);

//Not Found and Error Handler
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    //connect DB
    await connectToDB(process.env.MONGO_URI);
    console.log("DB Connected Succcessfully");
    //Server starts only once DB is connect
    app.listen(PORT, () => {
      console.log(`Server listening at PORT : ${PORT}`);
    });
  } catch (error) {
    console.log({ error });
  }
};

start();
