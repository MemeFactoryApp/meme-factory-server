const { Schema, model } = require("mongoose");

const groupSchema = new Schema({
    // this is the single embedded document and recommended approach for 1:1 relationships
    groupName: String,
    users: [Object],
    memes: [String],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Group = model("Group", groupSchema);

module.exports = Group;
