import jwt from "jsonwebtoken";

const generateToken = (res, userID) => {
  const token = jwt.sign({ userId: userID }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "DEVELOPMENT",
    sameSite: "strict",
    maxAge: 1000 * 60 * 60 * 2,
  });
};

export default generateToken;
