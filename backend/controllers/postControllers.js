const postService = require("../services/postService");

exports.createPost = async (req, res, next) => {
  const { title, content, user_id, book_id } = req.body;

  try {
    const newPost = await postService.createPost(
      title,
      content,
      user_id,
      book_id,
    );
    res.status(201).json(newPost);
  } catch (error) {
    next(error);
  }
};

exports.updatePost = async (req, res, next) => {
  const { id } = req.params;
  const { title, content } = req.body;

  try {
    const updatedPost = await postService.updatePost(id, { title, content });
    if (!updatedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json(updatedPost);
  } catch (error) {
    next(error);
  }
};

exports.deletePost = async (req, res, next) => {
  const { id } = req.params;

  try {
    const deletedPost = await postService.deletePost(id);
    if (!deletedPost) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted" });
  } catch (error) {
    next(error);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const posts = await postService.getAllPosts();
    res.json(posts);
  } catch (error) {
    next(error);
  }
};

exports.getPostsById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const post = await postService.getPostById(id);
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
    const posts = await postService.getPostsByBookId(book_id);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by book id:", error.message);
    next(error);
  }
};

exports.getPostsByUserId = async (req, res, next) => {
  try {
    const userId = req.params.user_id;
    const posts = await postService.getPostsByUserId(userId);
    res.status(200).json(posts);
  } catch (error) {
    console.error("Error fetching posts by user id:", error);
    next(error);
  }
};
