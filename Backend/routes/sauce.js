const express = require("express");

const router = express.Router();

const sauceCtrl = require("../controller/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

/** Liste des routes + middleware d'authentification (+ middleware de formatage des noms d'image) et leurs fonctions associées*/
router.post("/", auth, multer, sauceCtrl.createSauce);
router.get("/:id", auth, sauceCtrl.getOneSauce);
router.get("/", auth, sauceCtrl.getAllSauce);
router.put("/:id", auth, multer, sauceCtrl.updateSauce);
router.delete("/:id", auth, sauceCtrl.deleteSauce);
router.post("/:id/like", auth, sauceCtrl.like);

module.exports = router;
