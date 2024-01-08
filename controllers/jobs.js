const { StatusCodes } = require("http-status-codes");
const job = require("../model/jobs");
const { badRequestError, notFoundError } = require("../errors");

const getAllJobs = async (req, res) => {
  const { userID } = req.userDetails;
  const findJobs = await job
    .find({
      createdBy: userID,
    })
    .sort({ createdAt: "desc" });
  if (!findJobs.length) {
    throw new notFoundError("No jobs found");
  }
  res.status(StatusCodes.OK).json({ findJobs });
};

const getJob = async (req, res) => {
  const {
    params: { jobID },
    userDetails: { userID },
  } = req;
  if (!jobID) {
    throw new badRequestError("Please provide the job ID to be searched");
  }
  const findJob = await job.findOne({
    createdBy: userID,
    _id: jobID,
  });
  if (!findJob) {
    throw new notFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json(findJob);
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new badRequestError("Please provide company and position");
  }
  req.body.createdBy = req.userDetails.userID;

  const newJob = await job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ newJob });
};

const updateJob = async (req, res) => {
  const {
    params: { jobID },
    userDetails: { userID },
    body: { company, position, status },
  } = req;
  if (!company && !position && !status) {
    throw new badRequestError("Please provide the fields to be updated");
  }
  req.body.createdBy = userID;
  const updateJob = await job.findOneAndUpdate(
    {
      createdBy: userID,
      _id: jobID,
    },
    { ...req.body },
    {
      new: true,
      runValidators: true,
    }
  );
  if (!updateJob) {
    throw new notFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json(updateJob);
};

const deleteJob = async (req, res) => {
  const {
    params: { jobID },
    userDetails: { userID },
  } = req;
  const deleteJob = await job.findOneAndDelete({
    createdBy: userID,
    _id: jobID,
  });
  if (!deleteJob) {
    throw new notFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json(`The below job is now deleted:${deleteJob}`);
};

module.exports = {
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
