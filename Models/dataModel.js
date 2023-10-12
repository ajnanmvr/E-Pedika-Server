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
    url: {
      type: String,
      required: true,
      unique: true,
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
  },
  {
    timestamps: true,
  }
);

dataSchema.pre("find", function (next) {
  this.populate("category");
  next();
});
const DataModel = mongoose.model("WebSites", dataSchema);

module.exports = DataModel;
