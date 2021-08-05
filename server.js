const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const blogRoutes = require("./routes/blogRoutes");
require("dotenv").config();
const app = express();
const { checkUser } = require("./middleware/authMiddleware");
// middleware
app.use(
  cors({ origin: "https://mern-blog-app.netlify.app", credentials: true })
);

app.use(express.json({ limit: "50mb" }));
// app.use(cookieParser());
//connection to mongodb
mongoose
  .connect(process.env.MONGO_ATLAS, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  })
  .then((result) => {
    app.listen(process.env.PORT || 5000, () => {
      console.log("server started at port 5000");
    });
  })
  .catch((err) => console.log(err));

//routes
//app.get("*", checkUser);
app.get("/", (req, res) => {
  res.send({ user: res.locals.user });
});

// routes
app.use(authRoutes);
app.use(blogRoutes);

// 404 error page backend
app.use((req, res) => {
  res.send("404 error");
});
