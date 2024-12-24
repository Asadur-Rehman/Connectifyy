const mongoose = require("mongoose");
const { customHash } = require("../utils/integrity");
const Chat = require("../models/chatModel"); // Import Chat model to fetch ChatKey

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hash: { type: String, required: true }, // Integrity hash
  },
  { timestamps: true }
);

// Middleware to compute hash before saving the document
messageSchema.pre("save", async function (next) {
  if (this.isModified("content") || this.isNew) {
    try {
      const chat = await Chat.findById(this.chat).select("chatKey"); // Fetch ChatKey
      if (!chat || !chat.chatKey) {
        throw new Error("ChatKey not found for the associated chat.");
      }
      const timestamp = this.createdAt || new Date();
      this.hash = customHash(this.content, this.sender.toString(), timestamp.toISOString(), chat.chatKey);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Middleware to compute hash during updates
messageSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.content) {
    try {
      const message = await this.model.findOne(this.getQuery());
      const chat = await Chat.findById(message.chat).select("chatKey"); // Fetch ChatKey
      if (!chat || !chat.chatKey) {
        throw new Error("ChatKey not found for the associated chat.");
      }
      const timestamp = message.createdAt || new Date();
      this._update.hash = customHash(this._update.content, message.sender.toString(), timestamp.toISOString(), chat.chatKey);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
