const mongoose = require("mongoose");

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide the company name"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["pending", "interview", "declined"],
      default: "pending",
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("jobs", jobSchema);
