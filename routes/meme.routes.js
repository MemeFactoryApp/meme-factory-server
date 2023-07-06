const express = require("express");
const router = express.Router();
const axios = require("axios");
const Meme = require("../models/Meme.model");
const Group = require("../models/Group.model");
const authRoutes = require("../routes/auth.routes");
const { isAuthenticated } = require("../middleware/jwt.middleware");
const { default: mongoose } = require("mongoose");

// GET meme Templates from external service and pass to our router/api/templates
router.get("/templates", (req, res, next) => {
  axios
    .get(`${process.env.MEME_API_URL}/templates`, { headers: { 'X-API-KEY': process.env.API_KEY} })
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
    .get(`${process.env.MEME_API_URL}/templates/${id}`, { headers: { 'X-API-KEY': process.env.API_KEY} })
    .then((response) => res.json(response.data))
    .catch((err) => {
      console.log("error getting template details", err);
      res.status(500).json({
        message: "error getting template details",
        error: err,
      });
    });
});

// Create new meme

router.post("/templates/:id", (req, res, next) => {
  const { id } = req.params;
  const { text } = req.body;
  console.log(text);
  axios
    .post(`${process.env.MEME_API_URL}/templates/${id}`, { text }, { headers: { 'X-API-KEY': process.env.API_KEY} })
    .then((response) => {
      console.log(response.data);
      res.json(response.data);
    })
    .catch((err) => {
      console.log("error getting new meme", err);
      res.status(500).json({
        message: "error getting new meme",
        error: err,
      });
    });
});

// creating in database

router.post("/create", isAuthenticated, (req, res, next) => {
  const newMeme = {
    title: req.body.title,
    url: req.body.url,
    createdBy: req.payload._id,
  };
  Meme.create(newMeme).catch((e) => {
    console.log("error getting User details from DB", e);
  });
});
//getting all memes in database

router.get("/userMemes", (req, res, next) => {
  Meme.find()
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of groups", err);
      res.status(500).json({
        message: "error getting list of groups",
        error: err,
      });
    });
});


// Getting memes by id of creator

router.get("/memes", isAuthenticated, (req, res, next) => {
  Meme.find({ createdBy: { $in: [req.payload._id] } })
    .then((response) => {
      res.json(response);
    })
    .catch((err) => {
      console.log("error getting list of groups", err);
      res.status(500).json({
        message: "error getting list of groups",
        error: err,
      });
    });
});

// Get random meme 
router.get("/memes/random", (req, res, next) => {
  const random = (array) => array[Math.floor(Math.random() * array.length)];

  Meme.find()
    .then((memes) => {
      const { url } = random(memes);
      res.json({ url });
    })
    .catch((err) => {
      console.log("error getting list of groups", err);
      res.status(500).json({
        message: "error getting list of groups",
        error: err,
      });
    });
});


//Delete meme from all areas

router.delete("/memes/:id/delete", async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }
    const groups = await Group.find({ memes: { $in: id } })

    await Promise.all(groups.map((group) => {
      console.log(group.memes)
      group.memes.splice(group.memes.indexOf(id), 1)
      group.save()
    })) 

    await Meme.findByIdAndDelete(id)

    return res.json({ message: `Meme with id ${id} was removed successfully.` })

  } catch (error) {
    console.log(error)
    return res.status(500).json(error)
  }
})

module.exports = router;
