const { BadRequestError } = require("../errors");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  if (!chatId || !content) {
    throw new BadRequestError("Invalid data recieved for sending message!");
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  let message = await Message.create(newMessage);

  message = await Message.findOne({ _id: message._id })
    .populate("sender", "name profilePic")
    .populate("chat");

  message = await User.populate(message, {
    path: "chat.users",
    select: "name email profilePic",
  });

  await Chat.findByIdAndUpdate(chatId, { latestMessage: message._id });

  res.json(message);
};

const allMessages = async (req, res) => {
  const { chatId } = req.params;

  const messages = await Message.find({ chat: chatId })
    .populate("sender", "name email profilePic")
    .populate("chat");

  res.json(messages);
};

const deleteMessage = async (req, res) => {
  const { messageId } = req.params;

  const message = await Message.findOneAndDelete({
    _id: messageId,
    sender: req.user._id,
  });

  if (!message) {
    throw new BadRequestError("No Message Found for Id: " + messageId);
  }

  const allMessages = await Message.find({ chat: message.chat });

  if (allMessages.length > 0) {
    await Chat.findOneAndUpdate(
      { _id: message.chat },
      { latestMessage: allMessages[allMessages.length - 1]._id }
    );
  }

  res.json(message);
};

module.exports = {
  sendMessage,
  allMessages,
  deleteMessage,
};
