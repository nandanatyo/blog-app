const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const { isLoggedIn } = require("../middleware/auth");

router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().sort("-createdAt");
    res.render("posts/index", { posts });
  } catch (err) {
    req.flash("error", "Error fetching posts");
    res.redirect("/");
  }
});

router.get("/new", isLoggedIn, (req, res) => {
  res.render("posts/new");
});

router.post("/", isLoggedIn, async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = {
      id: req.session.user.id,
      username: req.session.user.username,
    };

    const newPost = new Post({ title, content, author });
    await newPost.save();

    req.flash("success", "Successfully created a new post");
    res.redirect("/posts");
  } catch (err) {
    req.flash("error", "Error creating post");
    res.redirect("/posts/new");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      req.flash("error", "Post not found");
      return res.redirect("/posts");
    }
    res.render("posts/show", { post });
  } catch (err) {
    req.flash("error", "Error fetching post");
    res.redirect("/posts");
  }
});

router.get("/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      req.flash("error", "Post not found");
      return res.redirect("/posts");
    }

    if (post.author.id.toString() !== req.session.user.id) {
      req.flash("error", "You do not have permission to edit this post");
      return res.redirect(`/posts/${req.params.id}`);
    }

    res.render("posts/edit", { post });
  } catch (err) {
    req.flash("error", "Error fetching post");
    res.redirect("/posts");
  }
});

router.put("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      req.flash("error", "Post not found");
      return res.redirect("/posts");
    }

    if (post.author.id.toString() !== req.session.user.id) {
      req.flash("error", "You do not have permission to edit this post");
      return res.redirect(`/posts/${req.params.id}`);
    }

    const { title, content } = req.body;
    await Post.findByIdAndUpdate(req.params.id, { title, content });

    req.flash("success", "Successfully updated post");
    res.redirect(`/posts/${req.params.id}`);
  } catch (err) {
    req.flash("error", "Error updating post");
    res.redirect(`/posts/${req.params.id}/edit`);
  }
});

router.delete("/:id", isLoggedIn, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      req.flash("error", "Post not found");
      return res.redirect("/posts");
    }

    if (post.author.id.toString() !== req.session.user.id) {
      req.flash("error", "You do not have permission to delete this post");
      return res.redirect(`/posts/${req.params.id}`);
    }

    await Post.findByIdAndDelete(req.params.id);

    req.flash("success", "Successfully deleted post");
    res.redirect("/posts");
  } catch (err) {
    req.flash("error", "Error deleting post");
    res.redirect(`/posts/${req.params.id}`);
  }
});

module.exports = router;
