const express = require("express");
const {
  getAllJobs,
  createJob,
  getJob,
  updateJob,
  deleteJob,
  getJobStats,
} = require("../controllers/jobs");
const testUserMiddleware = require("../middlewares/testUser");

const router = express.Router();

//routes
router.route("/").get(getAllJobs).post(testUserMiddleware, createJob);
router.route("/stats").get(getJobStats);
router
  .route("/:jobID")
  .get(getJob)
  .patch(testUserMiddleware, updateJob)
  .delete(testUserMiddleware, deleteJob);

module.exports = router;
