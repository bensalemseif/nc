// controllers/chatController.js
const Conversation = require("../models/consversationModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const createConversation = async (req, res) => {

  try {
    const userId = req.user.id;
    const admin = await User.findOne({ role: "admin" });

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    const conversation = new Conversation({
      userId,
      adminId: admin._id,
    });

    await conversation.save();

    res.status(201).json(conversation);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      $or: [{ userId: req.user.id }, { adminId: req.user.id }],
    }).populate("userId adminId messages");
    if (conversations.length === 0) {
      return res.status(202).json({ message: "No conversations found" });
    }
    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendMessage = async (req, res) => {
  try {
    const { text, senderId, receiverId, conversationId } = req.body;

    const message = new Message({
      text,
      senderId,
      receiverId,
      conversationId,
    });

    await message.save();

    // Add message reference to the conversation
    await Conversation.findByIdAndUpdate(conversationId, {
      $push: { messages: message._id },
    });

    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await Conversation.findById(
      conversationId
    ).populate(
      "userId adminId messages"
    );
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createConversation,
  sendMessage,
  getMessages,
  getConversations,
};
