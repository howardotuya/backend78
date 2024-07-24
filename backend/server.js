import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
dotenv.config();
import userRoutes from "./routes/userRoutes.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import connectDB from "./config/db.js";
import cookieParser from "cookie-parser";
const port = process.env.PORT || 5000;

connectDB();
const app = express();

// Enable CORS
app.use(
  cors({
    origin: ["https://frontend78.vercel.app", "http://localhost:3000"], // Your frontend's origin
    credentials: true, // Enable cookies to be included in CORS requests
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/users", userRoutes);
app.get("/", (req, res) => {
  res.send("API is running....");
});

app.use(notFound);
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
