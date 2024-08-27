const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const cohortsSchema = new Schema({
    cohortSlug: String,   
    cohortName: String,
    program: String,
    campus: String,  
    startDate: Date,
    endDate: Date,  
    inProgress: Boolean,
    programManager: String, 
    leadTeacher: String,
    totalHours: Number
    });

const Cohort = mongoose.model("Cohort", cohortsSchema);
    
module.exports = Cohort;
