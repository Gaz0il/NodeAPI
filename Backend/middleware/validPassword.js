const passwordShema = require("../models/password");

module.exports = (req, res, next) => {
  if (!passwordShema.validate(req.body.password)) {
    res.writeHead(400, '{"Password invalid : make it stronger please :) "}', {
      "content-type": "application/json",
    });
    res.end("Mot de passe incorrect");
  } else {
    next();
  }
};
