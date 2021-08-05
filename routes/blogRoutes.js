const { Router } = require("express");
const blogControllers = require("../controllers/blogControllers");
const { validToken } = require("../middleware/authMiddleware");
const router = Router();

router.get("/getblogs", blogControllers.blog_get);
router.post("/addblog", blogControllers.blog_post);
router.get("/singleblog", blogControllers.singleblog_get);
router.get("/userBlog", blogControllers.userBlog_get);
module.exports = router;
 