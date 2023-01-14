const { BadRequestError, NotFoundError } = require("../errors");
const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const User = require("../models/userModel");

const accessChats = async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    throw new BadRequestError("No UserId provided!");
  }

  let chats = await Chat.find({
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
      { isGroupChat: { $eq: false } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name email profilePic",
  });

  if (chats.length > 0) {
    return res.json({ chat: chats[0] });
  } else {
    const createdChat = await Chat.create({
      chatName: "sender",
      users: [req.user._id, userId],
    });

    const chat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );

    return res.json({ chat });
  }
};

const fetchChats = async (req, res) => {
  let chats = await Chat.find({
    users: { $elemMatch: { $eq: req.user._id } },
  })
    .populate("users", "-password")
    .populate("latestMessage")
    .populate("groupAdmin", "-password")
    .sort("-updatedAt");

  chats = await User.populate(chats, {
    path: "latestMessage.sender",
    select: "name email profilePic",
  });

  res.json({ chats });
};

const createGroup = async (req, res) => {
  const { users, name } = req.body;
  if (!users || !name) {
    throw new BadRequestError("Please provide users/group name!");
  }

  const usersList = JSON.parse(users);

  if (usersList.length < 2) {
    throw new BadRequestError("More than 2 users required to create a group!");
  }

  usersList.push(req.user._id);

  const createdChat = await Chat.create({
    chatName: name,
    users: usersList,
    isGroupChat: true,
    groupAdmin: req.user._id,
  });

  const chat = await Chat.findOne({ _id: createdChat._id })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  return res.json({ chat });
};

const renameGroup = async (req, res) => {
  const { chatId, name } = req.body;

  const chat = await Chat.findOneAndUpdate(
    { _id: chatId },
    {
      chatName: name,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    throw new NotFoundError("No group chat found with chatId:" + chatId);
  }

  res.json({ chat });
};

const addToGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  const chat = await Chat.findOneAndUpdate(
    { _id: chatId },
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    throw new NotFoundError("No group chat found with chatId:" + chatId);
  }

  res.json({ chat });
};

const removeFromGroup = async (req, res) => {
  const { chatId, userId } = req.body;

  let chat = await Chat.findOneAndUpdate(
    { _id: chatId },
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  );

  if (!chat) {
    throw new NotFoundError("No group chat found with chatId:" + chatId);
  }

  if (chat.users.length <= 1) {
    chat = await Chat.findOneAndDelete({ _id: chatId });
    await Message.deleteMany({ chat: chatId });

    return res.json({ chat });
  }

  if (chat.groupAdmin == userId) {
    console.log("admin removed");
    chat = await Chat.findOneAndUpdate(
      { _id: chatId },
      { groupAdmin: chat.users[0] },
      {
        new: true,
      }
    );
  }

  chat = await Chat.find({ _id: chatId })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  res.json({ chat });
};

module.exports = {
  accessChats,
  fetchChats,
  createGroup,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
