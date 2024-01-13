const mongoose = require("mongoose");
const Job = require("../model/jobs");
const mockData = require("./mock_jobs.json");
const url =
  "mongodb+srv://Anurag:Anuragmongodb%402023@task-manager.exkdxz8.mongodb.net/jobster-api?retryWrites=true&w=majority";
const connectToDB = async (mongo_url) => {
  await mongoose.connect(mongo_url);
  console.log("DB Connected for Population");
};

connectToDB(url);

const populateJobs = async () => {
  await Job.create(mockData);
};

populateJobs();
