const { Schema, model } = require("mongoose");

const memeSchema = new Schema(
  {
    // this is the single embedded document and recommended approach for 1:1 relationships
    createdBy: userSchema,

    template: {
      id: String,
      name: String,
      lines: Number,
      overlays,
      styles: [
        {
          type: String,
        },
      ],
      blank: String,
      example: {
        text: [
          {
            type: String,
          },
        ],
        url: String,
      },
      source: String,
      _self: String,
    },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Meme = model("Meme", memeSchema);

module.exports = Meme;
