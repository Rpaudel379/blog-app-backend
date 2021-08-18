const Blog = require("../model/Blog");

const { cloudinary } = require("./cloudinary");

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

  /*  try {
    const upload = await cloudinary.uploader.upload(image, {
      upload_preset: "React-blog",
    });

    console.log(upload);
  } catch (error) {
    console.log(error);
  } */

  try {
    const upload = await cloudinary.uploader.upload(image, {
      upload_preset: "React-blog",
    });
    const imgUrl = upload.secure_url;
    const cloudinary_public_id = upload.public_id;
    await Blog.create({
      title,
      body,
      image: imgUrl,
      userId,
      name,
      cloudinary_public_id,
    });

    res.status(201).json({ ok: true });
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
