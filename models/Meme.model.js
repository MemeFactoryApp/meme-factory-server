const { Schema, model } = require("mongoose");

const memeSchema = new Schema({
    // this is the single embedded document and recommended approach for 1:1 relationships
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    url: String,
});

const Meme = model("Meme", memeSchema);

module.exports = Meme;
