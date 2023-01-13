const { Router } = require("express");
const {
  fetchChats,
  accessChats,
  createGroup,
  renameGroup,
  removeFromGroup,
  addToGroup,
} = require("../controllers/chatControllers");

const router = new Router();

router.route("/").get(fetchChats).post(accessChats);
router.route("/group").post(createGroup);
router.route("/grouprename").patch(renameGroup);
router.route("/groupadd").patch(addToGroup);
router.route("/groupremove").patch(removeFromGroup);

module.exports = router;
