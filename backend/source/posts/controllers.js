const Post = require("./models");

exports.createPost = async (req, res, next) => {
  const { title, content, user_id, book_id } = req.body;

  try {
    const newPost = new Post({
      title,
      content,
      user_id,
      book_id,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  // Added 'next'
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (title !== undefined) {
      post.title = title;
    }
    if (content !== undefined) {
      post.content = content;
    }

    await post.save();
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    await post.deleteOne();
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.getPostsById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await Post.findById(id);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
};

exports.getPostsByBookId = async (req, res, next) => {
  try {
    const { book_id } = req.params;

    const posts = await Post.find({ book_id: book_id });

    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by book id:", error.message);
    next(error);
  }
};

exports.getPostsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const posts = await Post.find({ user_id: userId });
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by user id:", error);
    next(error);
  }
};
