const express = require("express");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

app.use(cookieParser());
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

mongoose
  .connect("mongodb://localhost:27017/auth", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Mongoose Connnected"))
  .catch((err) => console.log(err));

app.use(require("./routes/routes"));

app.listen(5000, () => {
  console.log("Server Running");
});
