import jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import expressAsyncHandler from "express-async-handler";

const protect = expressAsyncHandler(async (req, res, next) => {
  let token = req.cookies.jwt;

  if (token) {
    try {
      const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Use verify instead of decode
      req.user = await User.findById(decodedToken.userId).select("-password");

      if (!req.user) {
        res.status(401);
        throw new Error("Unauthorized, user not found");
      }

      next();
    } catch (error) {
      res.status(401);
      throw new Error("Unauthorized, invalid token");
    }
  } else {
    res.status(401);
    throw new Error("Unauthorized, no token");
  }
});

export { protect };
