const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const Meme = require("../models/Meme.model");
const Group = require("../models/Group.model");
const { isAuthenticated } = require("../middleware/jwt.middleware");

// Create Group

router.post("/groups/create", isAuthenticated, (req, res, next) => {
  const newGroup = {
    groupName: req.body.groupName,
    users: req.body.users,
    memes: req.body.memes,
    createdBy: req.payload._id,
  };
  Group.create(newGroup)
    .then((response) => res.status(201).json(response))
    .catch((err) => {
      console.log("error creating a new project", err);
      res.status(500).json({
        message: "error creating a new project",
        error: err,
      });
    });
});

//get list of groups available to that user

router.get("/groups", isAuthenticated, (req, res, next) => {
  console.log(req.payload.email.toString());
  Group.find({
    $or: [
      { createdBy: { $in: [req.payload._id] } },
      { users: { $elemMatch: { user: String(req.payload.email) } } },
    ],
  })
    .populate("memes")
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

router.get("/groups/:groupId", isAuthenticated, async (req, res) => {
  try {
    const { groupId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      res.status(400).json({ message: "Specified id is not valid" });
      return;
    }

    const group = await Group.findById(groupId);
    const memes = await Promise.all(
      group.memes.map(async (memeId) => {
        return await Meme.findById(memeId);
      })
    );

    console.log(memes);

    return res.status(200).json({ group: group, memes: memes });
  } catch (error) {
    console.log(error);
    return res.status(600).json({ msg: "error retrieving MEMES", error });
  }
});

// get group by Id and update

router.put("/groups/:groupId", (req, res, next) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  const newDetails = {
    groupName: req.body.groupName,
    users: [req.body.users],
    memes: [req.body.memes],
  };

  Group.findByIdAndUpdate(groupId, newDetails, { new: true })
    .then((updatedGroup) => res.json(updatedGroup))
    .catch((err) => {
      console.log("error updating Group", err);
      res.status(500).json({
        message: "error updating Group",
        error: err,
      });
    });
});

// Delete group by iD
router.delete("/groups/:groupId", (req, res, next) => {
  const { groupId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(groupId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Group.findByIdAndRemove(groupId)
    .then(() =>
      res.json({
        message: `Group with id ${groupId} & all associated tasks were removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("error deleting group", err);
      res.status(500).json({
        message: "error deleting group",
        error: err,
      });
    });
});

//Delete meme from group

router.delete("/groups/:groupId/memes/:id/delete", async (req, res) => {
  const { groupId } = req.params;
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id, groupId)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }
  Group.findById(groupId)
    .then((group) => {
      group.memes.splice(group.memes.indexOf(id), 1);
      group.save();
    })
    .then(() =>
      res.json({
        message: `Group with id ${groupId} & all associated tasks were removed successfully.`,
      })
    )
    .catch((err) => {
      console.log("error deleting group", err);
      res.status(500).json({
        message: "error deleting group",
        error: err,
      });
    });
});
module.exports = router;
