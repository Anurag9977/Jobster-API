const { StatusCodes } = require("http-status-codes");
const Job = require("../model/jobs");
const { badRequestError, notFoundError } = require("../errors");
const { default: mongoose } = require("mongoose");
const moment = require("moment");

const getJobStats = async (req, res) => {
  const { userID } = req.userDetails;
  //Aggregation for Detailed Stats
  let getStats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userID),
      },
    },
    {
      $group: {
        _id: "$status",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  // getStats.forEach((stat) => {
  //   defaultStats[stat._id] = stat.count;
  // });
  //using reduce
  getStats = getStats.reduce((acc, curr) => {
    acc[curr._id] = curr.count;
    return acc;
  }, {});
  let defaultStats = {};
  defaultStats.pending = getStats.pending || 0;
  defaultStats.interview = getStats.interview || 0;
  defaultStats.declined = getStats.declined || 0;

  //Aggregation for Monthly Applications
  let monthlyStats = await Job.aggregate([
    {
      $match: {
        createdBy: new mongoose.Types.ObjectId(userID),
      },
    },
    {
      $group: {
        _id: {
          year: {
            $year: "$createdAt",
          },
          month: {
            $month: "$createdAt",
          },
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        "_id.year": -1,
        "_id.month": -1,
      },
    },
    {
      $limit: 6,
    },
  ]);

  monthlyStats = monthlyStats
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;
      const date = moment()
        .month(month - 1)
        .year(year)
        .format("MMM Y");
      return { date, count };
    })
    .reverse();
  res
    .status(StatusCodes.OK)
    .json({ defaultStats, monthlyApplications: monthlyStats });
};
const getAllJobs = async (req, res) => {
  const { userID } = req.userDetails;
  const { search, status, jobType, sort } = req.query;
  let queryObject = {};
  queryObject.createdBy = userID;
  if (search) {
    queryObject.position = {
      $regex: search,
      $options: "i",
    };
  }
  if (status && status !== "all") {
    queryObject.status = status;
  }
  if (jobType && jobType !== "all") {
    queryObject.jobType = jobType;
  }

  let result = Job.find({ ...queryObject });
  if (sort === "latest") {
    result = result.sort({ createdAt: "desc" });
  }
  if (sort === "oldest") {
    result = result.sort({ createdAt: "asc" });
  }
  if (sort === "a-z") {
    result = result.sort({ position: "asc" });
  }
  if (sort === "z-a") {
    result = result.sort({ position: "desc" });
  }
  //Pagination
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  const skip = (page - 1) * limit;
  result = result.skip(skip).limit(limit);
  const jobs = await result;
  //Total jobs and number of pages
  const totalJobs = await Job.countDocuments({ ...queryObject });
  const numOfPages = Math.ceil(totalJobs / limit);

  if (!jobs.length) {
    throw new notFoundError("No jobs found");
  }
  res.status(StatusCodes.OK).json({ jobs, numOfPages, totalJobs });
};

const getJob = async (req, res) => {
  const {
    params: { jobID },
    userDetails: { userID },
  } = req;

  if (!jobID) {
    throw new badRequestError("Please provide the job ID to be searched");
  }
  const job = await Job.findOne({
    createdBy: userID,
    _id: jobID,
  });
  if (!job) {
    throw new notFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json(job);
};

const createJob = async (req, res) => {
  const { company, position } = req.body;
  if (!company || !position) {
    throw new badRequestError("Please provide company and position");
  }
  req.body.createdBy = req.userDetails.userID;

  const job = await Job.create({ ...req.body });
  res.status(StatusCodes.CREATED).json({ job });
};

const updateJob = async (req, res) => {
  const {
    params: { jobID },
    userDetails: { userID },
    body: { company, position },
  } = req;
  if (!company && !position) {
    throw new badRequestError("Please provide the fields to be updated");
  }
  req.body.createdBy = userID;
  const job = await Job.findOneAndUpdate(
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

  if (!job) {
    throw new notFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json({ job });
};

const deleteJob = async (req, res) => {
  const {
    params: { jobID },
    userDetails: { userID },
  } = req;
  const job = await Job.findOneAndDelete({
    createdBy: userID,
    _id: jobID,
  });
  if (!job) {
    throw new notFoundError("Job Not Found");
  }
  res.status(StatusCodes.OK).json();
};

module.exports = {
  getJobStats,
  getAllJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob,
};
