const mongoose = require("mongoose");
const Job = require("../model/jobs");
const mockData = require("./mock_jobs.json");
const url = "###";
const connectToDB = async (mongo_url) => {
  await mongoose.connect(mongo_url);
  console.log("DB Connected for Population");
};

connectToDB(url);

const populateJobs = async () => {
  await Job.create(mockData);
};

populateJobs();
