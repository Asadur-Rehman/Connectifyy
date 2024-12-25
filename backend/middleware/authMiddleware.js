const { validateToken} = require('../utils/generateToken.js')
const User = require("../models/userModel.js");

const protect = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    // console.log("token", token);

    if (!token) {
      return res.status(401).json({ success: false, message: `Token Missing` });
    }
    try {
      // Verifying the Token using our custom tokenValidator function
      const decode = validateToken(token);
      console.log("decode",decode)
      // console.log("decoded user:", decode);

      req.user = await User.findById(decode.userId).select("-password");
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
