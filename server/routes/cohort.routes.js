const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const { isAuthenticated } = require("../middleware/jwt.middleware");

const Cohort = require("../models/Cohort.model");
const Student = require("../models/Student.model");

// creates a new cohort
router.post("/cohorts", isAuthenticated, (req, res, next) => {
    const newCohort = req.body;
    Cohort.create(newCohort)
        .then((newCohortFromDB) => {
            console.log("succesfully created cohort");
            res.status(201).json(newCohortFromDB);
        })
        .catch((error) => {
            console.log("Uh Oh... Error creating cohort.");
            res.status(500).json({ error: "error creating cohort" });
            next(error);
        })
})

// retrieves all of the cohorts in the database collection
router.get("/cohorts", (req, res, next) => {
    // res.json(cohorts)
    Cohort.find({})
        .then((cohorts) => {
            console.log("Retrieved cohorts -> ", cohorts);

            res.status(200).json(cohorts);
        })
        .catch((error) => {
            console.error("Error while retrieving cohorts -> ", error);
            res.status(500).json({ error: "Failed to retrieve cohorts" });
            next(error);
        });
});

// retrieves a specific cohort by id
router.get("/cohorts/:cohortId", (req, res, next) => {

    Cohort.findById({ _id: req.params.cohortId })
        .then((cohortsFromDB) => {
            console.log("Retrieved cohorts -> ", cohortsFromDB);
            res.status(200).json(cohortsFromDB)
        })
        .catch((error) => {
            console.error("Error while retrieving cohorts ->", error);
            res.status(500).json({ error: "Failed to retrieve cohorts" });
            next(error);
        })
})

// updates a specific cohort by id
router.put("/cohorts/:cohortId", isAuthenticated, (req, res, next) => {
    Cohort.findByIdAndUpdate(req.params.cohortId, req.body, { new: true })
        .then((updatedCohort) => {
            res.status(200).json(updatedCohort);
        })
        .catch((error) => {
            res.status(500).json({ message: "Error while updating a single cohort" });
            next(error);
        });
});

// deletes a specific cohort by id
router.delete("/cohorts/:cohortId", isAuthenticated, (req, res, next) => {
    Cohort.findByIdAndDelete(req.params.cohortId)
        .then(() => {
            res.status(204).send();
        })
        .catch((error) => {
            res.status(500).json({ message: "Error while deleting a single cohort" });
            next(error);
        });
});


module.exports = router;