const Post = require("../models/postModels");

class PostService {
  /**
   * Creates a new post.
   * @param {string} title - The title of the post.
   * @param {string} content - The content of the post.
   * @param {number} userId - The ID of the user creating the post.
   * @param {number} bookId - The ID of the book related to the post.
   * @returns {object} The newly created post object.
   */
  async createPost(title, content, userId, bookId) {
    const newPost = new Post({
      title,
      content,
      user_id: userId,
      book_id: bookId,
    });
    await newPost.save();
    return newPost;
  }

  /**
   * Updates an existing post.
   * @param {string} id - The ID of the post to update.
   * @param {object} updateData - An object containing the fields to update (title, content).
   * @returns {object|null} The updated post object, or null if not found.
   */
  async updatePost(id, updateData) {
    const post = await Post.findById(id);
    if (!post) {
      return null;
    }

    if (updateData.title !== undefined) {
      post.title = updateData.title;
    }
    if (updateData.content !== undefined) {
      post.content = updateData.content;
    }

    await post.save();
    return post;
  }

  /**
   * Deletes a post by its ID.
   * @param {string} id - The ID of the post to delete.
   * @returns {object|null} The deleted post object, or null if not found.
   */
  async deletePost(id) {
    const post = await Post.findById(id);
    if (!post) {
      return null;
    }
    await post.deleteOne();
    return post;
  }

  /**
   * Retrieves all posts.
   * @returns {Array} A list of all post objects.
   */
  async getAllPosts() {
    const posts = await Post.find();
    return posts;
  }

  /**
   * Retrieves a single post by its ID.
   * @param {string} id - The ID of the post to retrieve.
   * @returns {object|null} The post object, or null if not found.
   */
  async getPostById(id) {
    const post = await Post.findById(id);
    return post;
  }

  /**
   * Retrieves posts by a specific book ID.
   * @param {number} bookId - The ID of the book.
   * @returns {Array} A list of post objects related to the book.
   */
  async getPostsByBookId(bookId) {
    const posts = await Post.find({ book_id: bookId });
    return posts;
  }

  /**
   * Retrieves posts by a specific user ID.
   * @param {number} userId - The ID of the user.
   * @returns {Array} A list of post objects created by the user.
   */
  async getPostsByUserId(userId) {
    const posts = await Post.find({ user_id: userId });
    return posts;
  }
}

module.exports = new PostService();
