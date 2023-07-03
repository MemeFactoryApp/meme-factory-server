require("dotenv").config();
require("./db");

const express = require("express");

const app = express();
require("./config")(app);
require("axios");

// 👇 Start handling routes here

// const allRoutes = require("./routes");
// app.use("/api", allRoutes);

const indexRoutes = require("./routes/index.routes");
app.use("/api", indexRoutes);

// we can now use IsAuthenicated in our routes when created
const memeRoutes = require("./routes/meme.routes");
app.use("/api", memeRoutes);

const groupRoutes = require('./routes/group.routes');
app.use('/api', groupRoutes)

const authRouter = require("./routes/auth.routes");
app.use("/auth", authRouter);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require("./error-handling")(app);

module.exports = app;
