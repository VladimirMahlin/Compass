const bcrypt = require("bcrypt");
const { mySqlPromiseConfig } = require("../_config/mySqlConfig");

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10);

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const validatePassword = (password) => {
  const passwordMinLength = 8;
  const passwordHasNumber = /\d/;
  const passwordHasUppercase = /[A-Z]/;
  const passwordHasLowercase = /[a-z]/;
  const passwordHasSpecialChar = /[^A-Za-z0-9]/;

  let errors = [];

  if (password.length < passwordMinLength) {
    errors.push("Password must be at least 8 characters long.");
  }
  if (!passwordHasNumber.test(password)) {
    errors.push("Password must include at least one number.");
  }
  if (!passwordHasUppercase.test(password)) {
    errors.push("Password must include at least one uppercase letter.");
  }
  if (!passwordHasLowercase.test(password)) {
    errors.push("Password must include at least one lowercase letter.");
  }
  if (!passwordHasSpecialChar.test(password)) {
    errors.push("Password must include at least one special character.");
  }

  return {
    isValid: errors.length === 0,
    errors: errors,
  };
};

class UserService {
  /**
   * Registers a new user.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {string} Success message.
   * @throws {Error} If email or password is invalid or email already exists.
   */
  async register(email, password) {
    if (!email || !password) {
      throw new Error("Please provide an email and a password.");
    }

    if (!isValidEmail(email)) {
      throw new Error("Please enter a valid email address.");
    }

    const passwordValidation = validatePassword(password);
    if (!passwordValidation.isValid) {
      const error = new Error("Password validation failed.");
      error.errors = passwordValidation.errors;
      throw error;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
      await mySqlPromiseConfig.execute(
        "INSERT INTO users (email, password, name, bio) VALUES (?, ?, ?, ?)",
        [email, hashedPassword, "John Doe", "John Doe is a mysterious person."],
      );
      return "User registered successfully";
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        const dupError = new Error("Email already exists");
        dupError.statusCode = 409;
        throw dupError;
      }
      throw error;
    }
  }

  /**
   * Logs in a user.
   * @param {string} email - User's email.
   * @param {string} password - User's password.
   * @returns {object} User object with id, email, name.
   * @throws {Error} If email or password is invalid.
   */
  async login(email, password) {
    if (!email || !password) {
      throw new Error("Please provide an email and a password.");
    }

    const [results] = await mySqlPromiseConfig.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    if (results.length === 0) {
      throw new Error("Invalid email or password");
    }

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      return { id: user.id, email: user.email, name: user.name };
    } else {
      throw new Error("Invalid email or password");
    }
  }

  /**
   * Logs out a user by destroying their session.
   * @param {object} session - The Express session object.
   * @returns {string} Success message.
   * @throws {Error} If session destruction fails.
   */
  async logout(session) {
    return new Promise((resolve, reject) => {
      session.destroy((err) => {
        if (err) {
          return reject(err);
        }
        resolve("Logout successful");
      });
    });
  }

  /**
   * Retrieves all users.
   * @returns {Array} List of user objects.
   */
  async getAllUsers() {
    const [results] = await mySqlPromiseConfig.query(
      "SELECT id, email, created_at, name, bio FROM users",
    );
    return results;
  }

  /**
   * Retrieves a user by their ID.
   * @param {number} userId - The ID of the user.
   * @returns {object|null} The user object, or null if not found.
   * @throws {Error} If user ID is not provided.
   */
  async getUserById(userId) {
    if (!userId) {
      throw new Error("User ID is required");
    }

    const [results] = await mySqlPromiseConfig.execute(
      "SELECT id, email, created_at, name, bio, avatar FROM users WHERE id = ?",
      [userId],
    );
    if (results.length === 0) {
      return null; // User not found
    }
    return results[0];
  }

  /**
   * Updates a user's information.
   * @param {number} userId - The ID of the user to update.
   * @param {object} updateData - Object containing name, bio, and avatar.
   * @returns {string} Success message.
   * @throws {Error} If user ID is not provided, name/bio are missing, or user not found.
   */
  async updateUser(userId, updateData) {
    const { name, bio, avatar } = updateData;

    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!name || !bio) {
      throw new Error("Name and bio are required.");
    }

    const [result] = await mySqlPromiseConfig.execute(
      "UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?",
      [name, bio, avatar, userId],
    );
    if (result.affectedRows === 0) {
      return null; // User not found
    }
    return "User updated successfully";
  }

  /**
   * Checks if a user session is active and retrieves user details.
   * @param {object} session - The Express session object.
   * @returns {object} Object indicating isLoggedIn status and user details if logged in.
   * @throws {Error} If there's a database error.
   */
  async checkSession(session) {
    if (session.userId) {
      const [results] = await mySqlPromiseConfig.execute(
        "SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ?",
        [session.userId],
      );
      if (results.length === 0) {
        return { isLoggedIn: false, message: "User not found" };
      }
      const user = results[0];
      return {
        isLoggedIn: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          bio: user.bio,
          avatar: user.avatar,
          created_at: user.created_at,
        },
      };
    } else {
      return { isLoggedIn: false };
    }
  }
}

module.exports = new UserService();
