const { Schema, model } = require("mongoose");

const MessageModel = Schema(
  {
    sender: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
      trim: true,
    },
    chat: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Chat",
    },
  },
  {
    timestamps: true,
  }
);

const Message = model("Message", MessageModel);

module.exports = Message;
