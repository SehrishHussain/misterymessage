import mongoose, { Schema, Document } from "mongoose";

// ----------------------------
// Message Schema
// ----------------------------
export interface Message extends Document {
  content: string;
  createdAt: Date;
  status: "private" | "public"; // message wall type
  fromUser?: mongoose.Types.ObjectId; // logged-in sender (optional)
  senderName?: string; // optional display name for anonymous sender
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    required: true,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["private", "public"],
    default: "private",
  },
  fromUser: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  senderName: {
    type: String,
  },
});

// ----------------------------
// User Schema
// ----------------------------
export interface User extends Document {
  username: string;
  email: string;
  password: string;

  // new optional profile info
  name?: string;
  bio?: string;
  image?: string; // Cloudinary URL
  isPublic: boolean; // profile visibility

  // old fields (kept)
  isAcceptingMessages: boolean;
  messages: Message[];

  // new optional helper fields
  profileCreatedAt: Date;
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, "username is required"],
    trim: true,
    unique: true,
  },
  email: {
    type: String,
    required: [true, "email is required"],
    unique: true,
    match: [/.+\@.+\..+/, "please use a valid email address"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },

  // New profile fields
  name: {
    type: String,
    trim: true,
  },
  bio: {
    type: String,
    maxlength: 500,
  },
  image: {
    type: String, // Cloudinary URL
  },
  isPublic: {
    type: Boolean,
    default: true, // profile private by default
  },

  // Old logic (kept)
  isAcceptingMessages: {
    type: Boolean,
    default: true,
  },
  messages: [MessageSchema],

  // New helper
  profileCreatedAt: {
    type: Date,
    default: Date.now,
  },
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>("User", UserSchema);

export default UserModel;
