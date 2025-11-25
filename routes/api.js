const express = require("express");
const passport = require("passport");

const router = express.Router();
const authenticatedRouter = express.Router();
const userController = require('../controllers/UserController');
const authController = require('../controllers/AuthController');

router.post("/signup", authController.signup);
router.post("/login", authController.login);

/* Routes protected with JWT */
authenticatedRouter.use(passport.authenticate("jwt", { session: false }));

authenticatedRouter.get("/get-users", userController.getUsers);
authenticatedRouter.get("/get-profile", userController.getProfile);
authenticatedRouter.post("/update-password", authController.updatePassword);

router.use('/', authenticatedRouter);
/* End JWT protection */

module.exports = router;
