const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "please add title"],
      minlength: [5, "minlength is 5 characters"],
      maxlength: [100, "maxlength is 100 characters"],
    },
    body: {
      type: String,
      required: [true, "please add body"],
      minlength: [10, "minlength is 10 characters"],
      maxlength: [2000, "maxlength is 1000 characters"],
    },
    image: {
      type: String,
      required: [true, "please add image"],
    },
    userId: {
      type: String,
      required: [true, "required userId"],
    },
    name: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Blog = mongoose.model("blog", blogSchema);

module.exports = Blog;
