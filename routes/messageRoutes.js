const { Router } = require("express");
const {
  allMessages,
  sendMessage,
  deleteMessage,
} = require("../controllers/messageControllers");

const router = Router();

router.route("/").post(sendMessage);
router.route("/:chatId").get(allMessages);
router.route("/delete/:messageId").delete(deleteMessage);

module.exports = router;
