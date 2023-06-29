const express = require("express");
const router = express.Router();

const axios = require("axios");

// const Meme = require("../models/Meme.model");

// GET meme Templates from external service and pass to our router/api/templates
router.get("/templates", (req, res, next) => {

  axios
    .get(`${process.env.MEME_API_URL}/templates`)
    .then((response) => res.json(response.data))
    .catch((err) => {
      console.log("error getting list of templates", err);
      res.status(500).json({
        message: "error getting list of templates",
        error: err,
      });
    });
});

module.exports = router;