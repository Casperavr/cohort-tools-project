const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Student = require("../models/Student.model");
const Cohort = require("../models/Cohort.model");

// creates a new student
router.post("/students", isAuthenticated, (req, res, next) => {
    const newStudent = req.body;
    Student.create(newStudent)
        .then((newStudentFromDB) => {
            console.log("succesfully created student");
            res.status(201).json(newStudentFromDB);
        })
        .catch((error) => {
            console.log("Uh Oh... Error creating student.");
            res.status(500).json({ error: "error creating student" });
            next(error);
        })
})

// retrieves all of the students in the database collection
router.get('/students', (req, res, next) => {
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
            next(error);
        });
})

// retrieves all of the students for a given cohort
router.get("/students/cohort/:cohortId", (req, res, next) => {
    const { cohortId } = req.params

    Student.find({ cohort: cohortId })
        .populate("cohort")
        .then((studentsFromDB) => {
            console.log("Retrieved students -> ", studentsFromDB);
            res.status(200).json(studentsFromDB)
        })
        .catch((error) => {
            console.error("Error while retrieving students ->", error);
            res.status(500).json({ error: "Failed to retrieve students" });
            next(error);
        })
})

// retrieves a specific student by id
router.get("/students/:studentId", (req, res, next) => {

    Student.findById(req.params.studentId)
        .populate("cohort")
        .then((studentFromDB) => {
            console.log("Retrieved student -> ", studentFromDB);
            res.status(200).json(studentFromDB)
        })
        .catch((error) => {
            console.error("Error while retrieving students ->", error);
            res.status(500).json({ error: "Failed to retrieve students" });
            next(error);
        })
})

// updates a specific student by id
router.put("/students/:studentId", isAuthenticated, (req, res, next) => {
    Student.findByIdAndUpdate(req.params.studentId, req.body, { new: true })
        .then((updatedStudent) => {
            res.status(200).json(updatedStudent);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error while updating a single student" });
            next(error);
        });
});

// deletes a specific student by id
router.delete("/students/:studentId", isAuthenticated, (req, res, next) => {
    Student.findByIdAndDelete(req.params.studentId)
        .then(() => {
            res.status(204).send();
        })
        .catch((error) => {
            res.status(500).json({ message: "Error while deleting a single student" });
            next(error);
        });
});



module.exports = router;