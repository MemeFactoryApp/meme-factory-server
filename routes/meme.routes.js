const express = require("express");
const router = express.Router();

const Meme = require("../models/Meme.model");

// GET Meme Templates api/templates
router.get("/templates", (req, res, next) => {});

module.exports = router;
