const mongoose = require("mongoose");
const { customHash } = require("../utils/integrity");
const Chat = require("../models/chatModel"); // Import Chat model to fetch ChatKey

const messageSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: { type: mongoose.Schema.Types.ObjectId, ref: "Chat" },
    readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    hash: { type: String, required: true, immutable: true }, // Integrity hash (immutable)
  },
  { timestamps: true }
);

// Middleware to compute hash before saving the document
messageSchema.pre("save", async function (next) {
  // Only calculate the hash when the document is being created
  if (this.isNew) {
    try {
      const chat = await Chat.findById(this.chat).select("chatKey"); // Fetch ChatKey
      if (!chat || !chat.chatKey) {
        throw new Error("ChatKey not found for the associated chat.");
      }
      // Compute and assign the hash
      this.hash = customHash(this.content, this.sender.toString(), chat.chatKey);
    } catch (error) {
      return next(error);
    }
  }
  next();
});

// Prevent hash updates explicitly (just in case)
messageSchema.pre("findOneAndUpdate", async function (next) {
  if (this._update.hash) {
    return next(new Error("Hash field cannot be updated."));
  }
  next();
});

const Message = mongoose.model("Message", messageSchema);
module.exports = Message;
