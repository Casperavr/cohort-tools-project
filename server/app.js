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


//
// STUDENT ROUTES
//

// creates a new student
app.post("/api/students", (req, res, next) => {
  const newStudent = req.body;
  Student.create(newStudent)
    .then((newStudentFromDB) => {
      console.log("succesfully created student");
      res.status(201).json(newStudentFromDB);
    })
    .catch((error) => {
      console.log("Uh Oh... Error creating student.");
      res.status(500).json({error: "error creating student"});
    })
})

// retrieves all of the students in the database collection
app.get('/api/students', (req, res) => {
  // res.json(students);
  Student.find({})
    .populate("cohort")
    .then((students) => {
      console.log("Retrieved students -> ", students);

      res.status(200).json(students);
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    });
})

// retrieves all of the students for a given cohort
app.get("/api/students/cohort/:cohortId", (req, res, next) => {
  const { cohortId } = req.params

  Student.find({cohort: cohortId})
    .populate("cohort")
    .then((studentsFromDB) => {
      console.log("Retrieved students -> ", studentsFromDB);
      res.status(200).json(studentsFromDB)
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    })
})

// retrieves a specific student by id
app.get("/api/students/:studentId", (req, res, next) => {

  Student.findById(req.params.studentId)
    .populate("cohort")
    .then((studentFromDB) => {
      console.log("Retrieved student -> ", studentFromDB);
      res.status(200).json(studentFromDB)
    })
    .catch((error) => {
      console.error("Error while retrieving students ->", error);
      res.status(500).json({ error: "Failed to retrieve students" });
    })
})

// updates a specific student by id
app.put("/api/students/:studentId", (req, res) => {
  Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
    .then((updatedStudent) => {
      res.status(200).json(updatedStudent);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while updating a single student" });
    });
});

// deletes a specific student by id
app.delete("/api/students/:studentId", (req, res) => {
  Student.findByIdAndDelete(req.params.studentId)
  .then(() => {
    res.status(204).send();
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while deleting a single student"});
  });
});


//
// COHORT ROUTES
//

// creates a new cohort
app.post("/api/cohorts", (req, res, next) => {
  const newCohort = req.body;
  Cohort.create(newCohort)
    .then((newCohortFromDB) => {
      console.log("succesfully created cohort");
      res.status(201).json(newCohortFromDB);
    })
    .catch((error) => {
      console.log("Uh Oh... Error creating cohort.");
      res.status(500).json({error: "error creating cohort"});
    })
})

// retrieves all of the cohorts in the database collection
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

// retrieves a specific cohort by id
app.get("/api/cohorts/:cohortId", (req, res, next) => {
  
  Cohort.findById({_id: req.params.cohortId})
  .then((cohortsFromDB) => {
    console.log("Retrieved cohorts -> ", cohortsFromDB);
    res.status(200).json(cohortsFromDB)
  })
  .catch((error) => {
    console.error("Error while retrieving cohorts ->", error);
    res.status(500).json({ error: "Failed to retrieve cohorts" });
  })
})

// updates a specific cohort by id
app.put("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
    .then((updatedCohort) => {
      res.status(200).json(updatedCohort);
    })
    .catch((error) => {
      res.status(500).json({ message: "Error while updating a single cohort" });
    });
});

// deletes a specific cohort by id
app.delete("/api/cohorts/:cohortId", (req, res) => {
  Cohort.findByIdAndDelete(req.params.cohortId)
  .then(() => {
    res.status(204).send();
  })
  .catch((error) => {
    res.status(500).json({ message: "Error while deleting a single cohort"});
  });
});

// START SERVER
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});