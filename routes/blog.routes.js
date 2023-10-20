const Blog = require("../models/Blog.model");
const User = require("../models/User.model");
const router = require("express").Router();
const gKey = process.env.MAP_API;

router.get("/blog", (req, res) => {

  if (req.session.currentUser) {
    const { username, password } = req.session.currentUser;
    User.findOne({ username }).then((user) => {
      if (password===user.password) {
        Blog.find()
        .then((blog) => {
          res.render("blog space/blog.hbs", {gKey, blog,  user  ,userInSession: req.session.currentUser});
        })
        .catch((err) => {
          console.log(err);
        });

      } else {
        res.render("login", {gKey, errorMessage: "Incorrect password." });
      }
    });
  } else {



  Blog.find()
    .then((blog) => {
      res.render("blog space/blog.hbs", {gKey, blog });
    })
    .catch((err) => {
      console.log(err);
    });
  }
});

router.get("/create-blog", (req, res) => {
  res.render("blog space/create-blog.hbs", { gKey });
});

router.post("/create-blog", (req, res) => {
  const { author, title, content, image } = req.body;
  console.log(req.body);
  Blog.create({ author, title, content, image })
    .then((blog) => {
      res.redirect("/blog");
    })
    .catch((err) => {
      console.log(err);
      res.render("blog space/blog.hbs", { gKey });
    });
});

router.get("/blog/:id", (req, res) => {
  const postId = req.params.id;
  Blog.findById(postId)
  .then((blog) => {
    res.render("blog space/blog-details", {gKey, blog });
  })
  .catch((err) => console.log(err));
});

router.get("/blog/:id/delete", (req, res) => {
  const postId = req.params.id;
  Blog.findByIdAndDelete(postId)
    .then(() => {
      res.redirect("/blog");
    })
    .catch((err) => console.log(err));
});

router.get("/blog/:id/edit", (req, res) => {
  const postId = req.params.id;
    Blog.findById(postId)
    .then((blog) => {
      res.render("blog space/edit-blog", {gKey, blog });
    })
    .catch((err) => console.log(err));
});

module.exports = router;

