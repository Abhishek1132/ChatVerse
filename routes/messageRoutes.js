const { Router } = require("express");
const {
  allMessages,
  sendMessage,
} = require("../controllers/messageControllers");

const router = Router();

router.route("/").post(sendMessage);
router.route("/:chatId").get(allMessages);

module.exports = router;
