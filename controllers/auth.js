const { StatusCodes } = require("http-status-codes");
const bcrypt = require("bcryptjs");
const user = require("../model/user");
const { unAuthorizedError, badRequestError } = require("../errors");
const register = async (req, res) => {
  //Password Hashing -> Handled using mongoose middleware
  const newUser = await user.create({ ...req.body });
  //Token creation
  const token = newUser.createJWT();
  res.status(StatusCodes.CREATED).json({
    user: {
      name: newUser.name,
    },
    token,
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new badRequestError("Please provide email and password");
  }

  const findUser = await user.findOne({ email });

  if (!findUser) {
    throw new unAuthorizedError("Email doesn't exist");
  }

  //Compare Password
  const isPasswordCorrect = await findUser.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new unAuthorizedError("Invalid Credentials");
  }

  const token = findUser.createJWT();
  res.status(StatusCodes.OK).json({
    user: {
      name: findUser.name,
    },
    token,
  });
};
module.exports = { register, login };
