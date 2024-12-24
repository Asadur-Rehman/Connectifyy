const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const { customHash } = require("../utils/integrity");

//@description     Get all Messages
//@route           GET /api/Message/:chatId
//@access          Protected
const allMessages = async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");

    // Validate integrity of each message
    const validatedMessages = [];
    for (const message of messages) {
      const chatKey = message.chat.chatKey; // Extract ChatKey
      const recalculatedHash = customHash(
        message.content,
        message.sender._id.toString(),
        chatKey
      );

      console.log("Hashes\n", message.hash);
      console.log(recalculatedHash);

      if (recalculatedHash === message.hash) {
        validatedMessages.push({ ...message.toObject(), integrity: "valid" });
      } else {
        validatedMessages.push({
          ...message.toObject(),
          integrity: "tempered",
        });
      }
    }

    console.log(validatedMessages);
    return res.status(200).json(validatedMessages);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in allMessages. Please try again.",
      error,
    });
  }
};

//@description     Create New Message
//@route           POST /api/Message/
//@access          Protected
const sendMessage = async (req, res) => {
  try {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
      console.log("Invalid data passed into request");
      return res.status(400).json({
        success: false,
        message: "Content and Chat ID are required.",
      });
    }

    // Prepare new message object
    const newMessage = {
      sender: req.user._id, // Assuming req.user contains the authenticated user
      content: content,
      chat: chatId,
    };

    // Create and populate the message
    // console.log("New Message", newMessage);
    let message = await Message.create(newMessage);

    // console.log("Message", message);

    message = await message.populate("sender", "name pic");
    message = await message.populate("chat");
    message = await User.populate(message, {
      path: "chat.users",
      select: "name pic email",
    });

    // Update latest message in the chat
    await Chat.findByIdAndUpdate(chatId, { latestMessage: message });

    return res.status(200).json(message);
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error in sendMessage. Please try again.",
      error,
    });
  }
};

module.exports = { allMessages, sendMessage };
