import mongoose from "mongoose";
import crypto from "crypto";
import validator from "validator";
import slugify from "slugify";

const UserSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validator.isEmail, "Please use a valid email"],
    },
    hashed_password: {
      type: String,
      required: "Password is required",
    },
    slug: String,
    salt: String,
    createdAt: {
      type: Date,
      default: Date.now,
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

UserSchema.virtual("password")
  .set(function (password) {
    this._password = password;
    this.salt = this.makeSalt();
    this.hashed_password = this.encryptPassword(password);
  })
  .get(function () {
    return this._password;
  });

UserSchema.path("hashed_password").validate(function (v) {
  if (this._password && this._password.length < 8) {
    this.invalidate("password", "Password must be at least 8 characters.");
  }
  if (this.isNew && !this._password) {
    this.invalidate("password", "Password is required");
  }
}, null);

UserSchema.methods = {
  authenticate: function (plainText) {
    return this.encryptPassword(plainText) === this.hashed_password;
  },
  encryptPassword: function (password) {
    if (!password) return "";
    try {
      return crypto
        .createHmac("sha1", this.salt)
        .update(password)
        .digest("hex");
    } catch (err) {
      return "";
    }
  },
  makeSalt: function () {
    return Math.round(new Date().valueOf() * Math.random()) + "";
  },
  createPasswordResetToken: function () {
    const resetToken = crypto.randomBytes(32).toString("hex");

    // Store encrypted resetToken to db
    this.passwordResetToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // Expires in 10 min (min you want, 60 seconds, 1000milseconds)
    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  },
};
// Create a slug
UserSchema.pre("save", function (next) {
  this.slug = slugify(`${this._id}`, {
    lower: true,
  });
  next();
});

export default mongoose.model("User", UserSchema);
