const express = require("express");
const router = express.Router();

const userCtrl = require("../controller/user");
/*Liste des API des user*/
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
