const User = require("../models/userModel");
const generateToken = require("../utils/generateToken");

//@description     Get or Search all users
//@route           GET /api/user?search=
//@access          Public
const allUsers = async (req, res) => {
  try {
    const keyword = req.query.search
      ? {
          $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(keyword).find({
      _id: { $ne: req.user._id },
    });
    return res.status(200).send(users);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in allUsers. Please try again.",
      error,
    });
  }
};

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({
        message: "Please Enter all the Feilds",
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });
    // console.log("user", user);

    if (user) {
      return res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      res.status(400).json({
        message: "User not found",
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      success: false,
      message: "error in registerUser. Please try again.",
      error: error,
    });
  }
};

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const authUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      // Return 400 Bad Request status code with error message
      return res.status(400).json({
        success: false,
        message: `Please Fill up All the Required Fields`,
      });
    }

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
      });
    } else {
      return res.status(400).json({
        message: "Invalid Email or Password",
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in authUser. Please try again.",
      error,
    });
  }
};

module.exports = { allUsers, registerUser, authUser };
