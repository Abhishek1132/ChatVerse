const { loginUser, registerUser } = require("../controllers/authControllers");

const { Router } = require("express");

const router = Router();

router.route("/login").post(loginUser);
router.route("/register").post(registerUser);

module.exports = router;
