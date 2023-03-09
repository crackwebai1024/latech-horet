import mongoose from "mongoose";
import slugify from "slugify";

// note schema
const NoteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    slug: String,
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    // virtuals true => it displays virtual schema
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create a slug
NoteSchema.pre("save", function (next) {
  this.slug = slugify(`${this._id}`, {
    lower: true,
  });
  next();
});

export default mongoose.model("Note", NoteSchema);
