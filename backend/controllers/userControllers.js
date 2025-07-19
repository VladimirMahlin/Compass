const userService = require("../services/userService");

exports.register = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const message = await userService.register(email, password);
    return res.status(201).json({ message: message });
  } catch (error) {
    if (error.message === "Password validation failed." && error.errors) {
      return res
        .status(400)
        .json({ message: error.message, errors: error.errors });
    }
    if (error.statusCode === 409) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    return next(error);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const user = await userService.login(email, password);
    req.session.userId = user.id;
    return res.status(200).json({
      message: "Authentication successful",
      user: user,
    });
  } catch (error) {
    if (
      error.message === "Invalid email or password" ||
      error.message === "Please provide an email and a password."
    ) {
      return res.status(401).json({ message: error.message });
    }
    return next(error);
  }
};

exports.logout = async (req, res, next) => {
  try {
    const message = await userService.logout(req.session);
    res.clearCookie("connect.sid");
    return res.status(200).json({ message: message });
  } catch (error) {
    return next(error);
  }
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    return res.status(200).json(users);
  } catch (error) {
    return next(error);
  }
};

exports.getUserById = async (req, res, next) => {
  const { userId } = req.params;
  try {
    const user = await userService.getUserById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json(user);
  } catch (error) {
    if (error.message === "User ID is required") {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

exports.updateUser = async (req, res, next) => {
  const { userId } = req.params;
  const { name, bio, avatar } = req.body;

  try {
    const message = await userService.updateUser(userId, { name, bio, avatar });
    if (!message) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: message });
  } catch (error) {
    if (
      error.message === "User ID is required" ||
      error.message === "Name and bio are required."
    ) {
      return res.status(400).json({ message: error.message });
    }
    return next(error);
  }
};

exports.checkSession = async (req, res, next) => {
  try {
    const sessionStatus = await userService.checkSession(req.session);
    return res.status(200).json(sessionStatus);
  } catch (error) {
    return next(error);
  }
};
