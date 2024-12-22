const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token", token);

    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }
    try {
      // Verifying the JWT using the secret key stored in environment variables
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decode",decode)

      req.user = await User.findById(decode.id).select("-password");
      // console.log("r", req.user);
    } catch (error) {
      // If JWT verification fails, return 401 Unauthorized response
      return res
        .status(500)
        .json({ success: false, message: "token is invalid" });
    }
    // If JWT is valid, move on to the next middleware or request handler
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "error in authMiddleware. Please try again.",
      error,
    });
  }
};

module.exports = { protect };
