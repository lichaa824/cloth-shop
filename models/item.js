const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  numberStock: {
    type: Number,
    min: [1, "Stock at least has to be 1!"],
    required: true,
  },
  price: {
    type: Number,
    min: [1, "Price at least has to be 1!"],
    required: true,
  },
  category: [{ type: Schema.Types.ObjectId, ref: "Category", required: true }],
});

ItemSchema.virtual("url").get(function () {
  return "/catalog/item/" + this._id;
});

module.exports = mongoose.model('Item', ItemSchema)