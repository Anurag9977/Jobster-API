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
      email: newUser.email,
      lastName: newUser.lastName,
      location: newUser.location,
      token,
    },
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
      email: findUser.email,
      lastName: findUser.lastName,
      location: findUser.location,
      token,
    },
  });
};

const updateUser = async (req, res) => {
  const {
    userDetails: { userID },
    body: { name, email, lastName, location },
  } = req;
  if (!name || !email || !lastName || !location) {
    throw new badRequestError("Please provide all the details");
  }
  const updateUser = await user.findOneAndUpdate(
    {
      _id: userID,
    },
    {
      name,
      email,
      lastName,
      location,
    },
    {
      new: true,
      runValidators: true,
    }
  );
  const token = updateUser.createJWT();
  return res.status(StatusCodes.OK).json({
    user: {
      name: updateUser.name,
      location: updateUser.location,
      email: updateUser.email,
      lastName: updateUser.lastName,
      token,
    },
  });
};
module.exports = { register, login, updateUser };
