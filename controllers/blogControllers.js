const Blog = require("../model/Blog");
const handleErrors = (err) => {
  //console.log(err.message, err.code, "code");
  let errors = {
    image: "",
    title: "",
    body: "",
  };

  if (err.message.includes("blog validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports.blog_get = async (req, res) => {
  try {
    const blog = await Blog.find();
    res.json(blog);
  } catch (err) {
    console.log(err, "catch error");
  }
};

module.exports.blog_post = async (req, res) => {
  const { title, body, image, userId, name } = req.body;

  try {
    const blog = await Blog.create({ title, body, image, userId, name });
    res.status(201).json(blog);
  } catch (err) {
    const errors = handleErrors(err);
    res.status(500).json(errors);
  }
};

module.exports.singleblog_get = async (req, res) => {
  const id = req.headers.blogid;
  try {
    const singleBlog = await Blog.findOne({ _id: id });
    res.status(201).json(singleBlog);
  } catch (err) {
    //console.log(err);
    res.status(404).json(err);
  }
};

module.exports.userBlog_get = async (req, res) => {
  const userId = req.headers.userid;
  try {
    const userBlog = await Blog.find({ userId });
    res.status(201).json(userBlog);
  } catch (err) {
    console.log(err);
    res.status(404).json(err);
  }
};
