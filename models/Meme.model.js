const { Schema, model } = require("mongoose");

const memeSchema = new Schema({
    // this is the single embedded document and recommended approach for 1:1 relationships
    title: String,
    url: String,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
});

const Meme = model("Meme", memeSchema);

module.exports = Meme;
