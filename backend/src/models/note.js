import mongoose from "mongoose";

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled",
    },
    content: {
      type: String,
      default: "",
    },
    date: {
      type: Date,
      default: Date.now,
    },
    pinned: {
      type: Boolean,
      default: false,
    },
    color: {
      type: Number,
      default: 0,
    },
    tilt: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Note", noteSchema);