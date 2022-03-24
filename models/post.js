const mongoose = require("mongoose")

const PostSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true
    },
    desc: {
      type: String,
      max: 500,
    },
    img: {
      default: "",
      type: String,
    },
    likes: {
      type: Array,
      default: [],
    },
    dislikes: {
      type: Array,
      default: [],
    },
    noOfanswers: [{
          type: String,
        }],
  },
  { timestamps: true }
);


module.exports = mongoose.model("Post", PostSchema);