const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
  author: String,
  content: String,
  title: String,
  image: {
    type: String,
    require: false
  }
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;