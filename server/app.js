const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose");

const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");
const { errorHandler, notFoundHandler } = require("./middleware/error-handling")

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();

// MIDDLEWARE
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5005']
})
);
app.use(express.json());
app.use(morgan("dev"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// MONGOOSE
// Establish connection
mongoose.connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to MongoDB. Database name: "${x.connections[0].name}"`))
  .catch(error => console.log("Error connection to MongoDB", error))

// ROUTES - https://expressjs.com/en/starter/basic-routing.html
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});

app.use("/auth", require("./routes/auth.routes"))
app.use("/api", require("./routes/cohort.routes"));
app.use("/api", require("./routes/student.routes"));



// Set up custom error handling middleware:
app.use(notFoundHandler);
app.use(errorHandler);

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});