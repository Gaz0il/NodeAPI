const express = require("express");
const router = express.Router();

const userCtrl = require("../controller/user");
const checkPassW = require("../middleware/validPassword"); // on vérifie via un middleware la validité du mot de passe
/*Liste des API des user*/
router.post("/signup", checkPassW, userCtrl.signup);
router.post("/login", userCtrl.login);

module.exports = router;
