const Sauce = require("../models/sauce");
const fs = require("fs");
const { request } = require("http");
const user = require("../models/user");

/*__CRUD__*/

/*___Spé Métier: créer une sauce  à 0 `likes & dislikes` et des array vides___*/
exports.createSauce = (req, res, next) => {
  const sauceObjet = JSON.parse(req.body.sauce);
  delete sauceObjet._id;
  const sauce = new Sauce({
    ...sauceObjet,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
    dislikes: 0,
    likes: 0,
    usersDisliked: [],
    usersLiked: [],
  });

  sauce
    .save()
    .then(() => res.status(201).json({ message: "objet enregistré !" }))
    .catch((error) => res.status(400).json({ error }));
};
/*___Spé Métier: modifier une sauce___*/
exports.updateSauce = (req, res, next) => {
  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };
  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(() => res.status(200).json({ message: "Objet modifié !" }))
    .catch((error) => res.status(400).json({ error }));
};
/*___Spé Métier: obtenir une sauce___*/
exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};
/*___Spé Métier: supprimer une sauce___*/
exports.deleteSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      const filename = sauce.imageUrl.split("/images/")[1];
      fs.unlink(`images/${filename}`, () => {
        Sauce.deleteOne({ _id: req.params.id })
          .then(() => res.status(200).json({ message: "Objet supprimé !" }))
          .catch((error) => res.status(400).json({ error }));
      });
    })
    .catch((error) => res.status(500).json({ error }));
};
/*___Spé Métier:  Obtenir les sauces___*/
exports.getAllSauce = (req, res, next) => {
  Sauce.find()
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

/*___Spé Métier: Gestion du likes___*/
/**Trois cas à prendre en charge via un switch case */

exports.like = (req, res, next) => {
  const userId = req.body.userId;

  switch (req.body.like) {
    case 0: // like = 0
      Sauce.findOne({ _id: req.params.id })
        .then((sauce) => {
          //on recherche le user dans l'array des userslikes
          // si oui on met à jour à la sauce: décremente like et on retire le userID de l'array
          if (sauce.usersLiked.find((user) => user === userId)) {
            Sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { likes: -1 },
                $pull: { usersLiked: userId },
              }
            );
          }
          //on recherche le user dans l'array des usersDislikes
          // si oui on met à jour à la sauce: decrement like et on retire le userID de l'array
          if (sauce.usersDisliked.find((user) => user === userId)) {
            sauce.updateOne(
              { _id: req.params.id },
              {
                $inc: { dislikes: -1 },
                $pull: { usersDisliked: userId },
              }
            );
          }
        })
        .then(() => {
          res.status(201).json({ message: "vote enregistré." });
        });
      break;
    case 1: // like = 1
      //on incremente le like
      //on ajoute l'utilisateur à l'array usersLiked
      {
        Sauce.updateOne(
          { _id: req.params.id },
          {
            $inc: { likes: 1 },
            $push: { usersLiked: userId },
          }
        ).then(() => {
          res.status(201).json({ message: "vote enregistré." });
        });
      }
      break;
    case -1: //like = -1
      //on incremente le dislike
      //on ajoute l'utilisateur à l'array usersDisliked
      Sauce.updateOne(
        { _id: req.params.id },
        {
          $inc: { dislikes: 1 },
          $push: { usersDisliked: userId },
        }
      ).then(() => {
        res.status(201).json({ message: "vote enregistré." });
      });
      break;
  }
};
