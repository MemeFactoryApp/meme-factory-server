const express = require("express");
const router = express.Router();

//const Meme = require("../models/Meme.model");
// const User = require("../models/User.model");

// GET meme Templates from external service and pass to our router/api/templates
router.get("/templates", (req, res, next) => {
  axios
    .get(`${process.env.REACT_APP_API_URL}/templates`)
    .then((response) => res.status(200).json(response))
    .catch((err) => {
      console.log("error getting list of projects", err);
      res.status(500).json({
        message: "error getting list of templates",
        error: err,
      });
    });
});

module.exports = router;
