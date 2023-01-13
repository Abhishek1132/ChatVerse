const { Router } = require("express");
const {
  deleteUser,
  searchUsers,
  getUser,
  updateUser,
} = require("../controllers/userControllers");

const router = Router();

router.route("/").get(searchUsers);
router.route("/:id").get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
