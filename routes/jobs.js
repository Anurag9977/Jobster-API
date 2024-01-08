const express = require("express");
const {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
} = require("../controllers/jobs");

const router = express.Router();

//routes
router.route("/").get(getAllJobs).post(createJob);
router.route("/:jobID").get(getJob).patch(updateJob).delete(deleteJob);

module.exports = router;
