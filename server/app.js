const express = require("express");
const morgan = require("morgan");
const cookieParser = require("cookie-parser");
const PORT = 5005;
const cors = require("cors");
const mongoose = require("mongoose")


const Cohort = require("./models/Cohort.model");
const Student = require("./models/Student.model");

// STATIC DATA
// Devs Team - Import the provided files with JSON data of students and cohorts here:
// ...

// these files are local and we want them from the db
// const cohorts = require("./cohorts.json")
// const students = require("./students.json")

// INITIALIZE EXPRESS APP - https://expressjs.com/en/4x/api.html#express
const app = express();


// MIDDLEWARE
// Research Team - Set up CORS middleware here:
// ...
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
// establish connection

mongoose.connect("mongodb://127.0.0.1:27017/cohort-tools-api")
  .then(x => console.log(`Connected to MongoDB. Database name: "${x.connections[0].name}"`))
  .catch(error => console.log("Error connection to MongoDB", error))



// ROUTES - https://expressjs.com/en/starter/basic-routing.html
// Devs Team - Start working on the routes here:
// ...
app.get("/docs", (req, res) => {
  res.sendFile(__dirname + "/views/docs.html");
});


app.get("/api/cohorts", (req, res) => {
  // res.json(cohorts)
  Cohort.find({})
    .then((cohorts) => {
      console.log("Retrieved cohorts -> ", cohorts);
      
      res.status(200).json(cohorts);
    })
    .catch((error) => {
      console.error("Error while retrieving cohorts -> ", error);
      res.status(500).json({error: "Failed to retrieve cohorts"});
    });
});


app.get('/api/students', (req, res) => {
  // res.json(students);
  Student.find({})
    .then((students) => {
      console.log("Retrieved students -> ", students);

      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
})


// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});