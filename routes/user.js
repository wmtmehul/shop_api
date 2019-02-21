const express = require("express");
const router = express.Router();
const UserController = require('../controllers/user')

router.post("/signup", UserController.signup);

router.post("/signin", UserController.signin);

router.delete("/:userId", UserController.delete_user);

module.exports = router;
