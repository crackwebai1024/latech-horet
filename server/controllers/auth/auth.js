import jwt from "jsonwebtoken";
import expressJwt from "express-jwt";
import config from "../../../config/config";
import errorHandler from "../../helpers/dbErrorHandler";
import User from "../../models/users/basic.model";

// create token for signin user
const createToken = (id) => {
  return jwt.sign({ _id: id }, config.jwtSecret, { expiresIn: "1h" });
};

const create = async (req, res, next) => {
  const element = new User(req.body);
  try {
    await element.save();
    if (next === undefined) {
      return res.status(200).json({
        message: "Successfully created!",
      });
    } else {
      await next();
    }
  } catch (err) {
    console.log(err);
    return res.status(400).json({
      error: errorHandler.getErrorMessage(err),
    });
  }
};

// check the user signin
const requireSignin = expressJwt({
  secret: config.jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});

// check the user has auth to access one's data
const hasAuthorization = (req, res, next) => {
  if (tokenBlacklist.includes(req.headers.authorization.split(" ")[1])) {
    return res.status("403").json({
      error: "User is not authorized",
    });
  } else {
    const authorized = req.auth._id;
    if (!authorized) {
      return res.status("403").json({
        error: "User is not authorized",
      });
    }
    next();
  }
};

// user signin with email and password
const signIn = async (req, res) => {
  let user = {};
  try {
    // check if the user data is in the database
    user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status("404").json({ error: `user not found` });
    }

    if (!user.authenticate(req.body.password)) {
      return res
        .status("401")
        .json({ error: "Email and password don't match." });
    }

    const token = createToken(user._id);

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        slug: user.slug,
      },
    });
  } catch (err) {
    return res.status("401").json({ error: "Could not sign in" });
  }
};

const tokenBlacklist = [];

const signOut = async (req, res) => {
  const token = req.headers.authorization.split(" ")[1];
  tokenBlacklist.push(token);
  return res.status(200).json({ message: "Token revoked successfully" });
};

export default {
  signIn,
  signOut,
  create,
  requireSignin,
  hasAuthorization,
};
