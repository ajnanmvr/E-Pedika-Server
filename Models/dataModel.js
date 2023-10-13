const mongoose = require("mongoose");

const dataSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: mongoose.Types.ObjectId,
      required: true,
      ref: "Category",
    },
    published: {
      type: Boolean,
      default: false,
    },
    thumbnail: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true, 
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
    },
    specs: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

dataSchema.pre("find", function (next) {
  this.populate("category");
  next();
});

const DataModel = mongoose.model("items", dataSchema);

module.exports = DataModel;
