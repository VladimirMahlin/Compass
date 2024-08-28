const bcrypt = require("bcrypt");
const { mySqlConfig } = require("../../_config/mySqlConfig");
const db = mySqlConfig;
require("dotenv").config();

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS);

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

const handleServerError = (res, error, operation) => {
  console.error(`Error during ${operation}:`, error);
  return res.status(500).json({ message: `Server error during ${operation}` });
};

exports.register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an email and a password." });
  }

  if (!isValidEmail(email)) {
    return res
      .status(400)
      .json({ message: "Please enter a valid email address." });
  }

  const passwordValidation = validatePassword(password);
  if (!passwordValidation.isValid) {
    return res.status(400).json({
      message: "Password validation failed.",
      errors: passwordValidation.errors,
    });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    db.execute(
      "INSERT INTO users (email, password, name, bio) VALUES (?, ?, ?, ?)",
      [email, hashedPassword, "John Doe", "John Doe is a mysterious person."],
      (err) => {
        if (err) {
          if (err.code === "ER_DUP_ENTRY") {
            return res.status(409).json({ message: "Email already exists" });
          }
          return handleServerError(res, err, "registration");
        }
        return res
          .status(201)
          .json({ message: "User registered successfully" });
      },
    );
  } catch (error) {
    return handleServerError(res, error, "registration");
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Please provide an email and a password." });
  }

  try {
    db.execute(
      "SELECT * FROM users WHERE email = ?",
      [email],
      async (err, results) => {
        if (err) {
          return handleServerError(res, err, "login");
        }

        if (results.length === 0) {
          return res.status(401).json({ message: "Invalid email or password" });
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (passwordMatch) {
          req.session.userId = user.id;
          return res.status(200).json({
            message: "Authentication successful",
            user: { id: user.id, email: user.email, name: user.name },
          });
        } else {
          return res.status(401).json({ message: "Invalid email or password" });
        }
      },
    );
  } catch (error) {
    return handleServerError(res, error, "login");
  }
};

exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return handleServerError(res, err, "logout");
    }
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: "Logout successful" });
  });
};

exports.getAllUsers = async (req, res) => {
  try {
    db.query(
      "SELECT id, email, created_at, name, bio FROM users",
      (err, results) => {
        if (err) {
          return handleServerError(res, err, "fetching users");
        }
        return res.status(200).json(results);
      },
    );
  } catch (error) {
    return handleServerError(res, error, "fetching users");
  }
};

exports.getUserById = async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  try {
    db.execute(
      "SELECT id, email, created_at, name, bio, avatar FROM users WHERE id = ?",
      [userId],
      (err, results) => {
        if (err) {
          return handleServerError(res, err, "fetching user");
        }
        if (results.length === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json(results[0]);
      },
    );
  } catch (error) {
    return handleServerError(res, error, "fetching user");
  }
};

exports.updateUser = async (req, res) => {
  const { name, bio, avatar } = req.body;
  const { userId } = req.params;

  if (!userId) {
    return res.status(400).json({ message: "User ID is required" });
  }

  if (!name || !bio) {
    return res.status(400).json({ message: "Name and bio are required." });
  }

  try {
    db.execute(
      "UPDATE users SET name = ?, bio = ?, avatar = ? WHERE id = ?",
      [name, bio, avatar, userId],
      (err, result) => {
        if (err) {
          return handleServerError(res, err, "updating user");
        }
        if (result.affectedRows === 0) {
          return res.status(404).json({ message: "User not found" });
        }
        return res.status(200).json({ message: "User updated successfully" });
      },
    );
  } catch (error) {
    return handleServerError(res, error, "updating user");
  }
};

exports.checkSession = async (req, res) => {
  if (req.session.userId) {
    try {
      db.execute(
        "SELECT id, email, name, bio, avatar, created_at FROM users WHERE id = ?",
        [req.session.userId],
        (err, results) => {
          if (err) {
            return handleServerError(res, err, "checking session");
          }
          if (results.length === 0) {
            return res
              .status(404)
              .json({ isLoggedIn: false, message: "User not found" });
          }
          const user = results[0];
          return res.status(200).json({
            isLoggedIn: true,
            user: {
              id: user.id,
              email: user.email,
              name: user.name,
              bio: user.bio,
              avatar: user.avatar,
              created_at: user.created_at,
            },
          });
        },
      );
    } catch (error) {
      return handleServerError(res, error, "checking session");
    }
  } else {
    return res.status(200).json({ isLoggedIn: false });
  }
};
