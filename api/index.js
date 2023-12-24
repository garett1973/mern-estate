import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoute from "./routes/user.route.js";

dotenv.config();

mongoose
  .connect(process.env.MONGODB_CONNECTION_URL)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.log(err);
  });

const app = express();

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});

app.use("/api/user", userRoute);

// // just an example of how to use express
// app.get("/test", (req, res) => {
//   res.send("Hello World!");
// });

// app.get("/json", (req, res) => {
//   res.json([
//     {
//       status: "success",
//       data: "data1",
//       name: "John Doe",
//     },
//   ]);
// });
