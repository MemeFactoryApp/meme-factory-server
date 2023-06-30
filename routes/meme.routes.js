//const { router } = require("../app");
//const router = require("express").Router();

const express = require("express");
const router = express.Router();
const axios = require("axios");
const Meme = require("../models/Meme.model");

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

//Get meme template by ID from external service and pass to our router/api/templates/:id
router.get("/templates/:id", (req, res, next) => {
  const { id } = req.params;
  axios
  .get(`${process.env.MEME_API_URL}/templates/${id}`)
  .then((response) => res.json(response.data))
    .catch((err) => {
      console.log("error getting template details", err);
      res.status(500).json({
        message: "error getting template details",
        error: err,
      });
    });
})

// Create new meme

router.post("/templates/:id", (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body
  console.log(text)
  axios
  .post(`${process.env.MEME_API_URL}/templates/${id}`, {text})
  .then((response) => {
    console.log(response.data)
    res.json(response.data)
  })
  .catch((err) => {
    console.log("error getting new meme", err);
    res.status(500).json({
      message: "error getting new meme",
      error: err,
    });
  })

  // Meme.create(newMeme)
  //     .then(response => res.json(response))
  //     .catch(err => {
  //         console.log("error creating a new project", err);
  //         res.status(500).json({
  //             message: "error creating a new project",
  //             error: err
  //         });
      // })
});

module.exports = router;
