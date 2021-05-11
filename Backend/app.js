const mongoose = require("mongoose");
const express = require("express");
const sauceRoutes = require("./routes/sauce");
const userRoutes = require("./routes/user");
const path = require("path");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const bodyParser = require("body-parser");

const app = express();
mongoose.set("useCreateIndex", true);
mongoose
  .connect(
    "mongodb+srv://writer:azerty1234@apioc.uiskk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",
    { useNewUrlParser: true, useUnifiedTopology: true }
  )
  .then(() => console.log("Connexion à MongoDB réussie !"))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  /*règles permettant d’autoriser différents sites sur différents domaines à interagir entre eux*/
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

/** Pour limiter la surcharge des requetes (DDOS) */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(helmet()); // Secure your Express apps by setting various HTTP headers
app.use(limiter);
app.use(bodyParser.json());
app.use("/api/sauces", sauceRoutes);
app.use("/images", express.static(path.join(__dirname, "images")));
app.use("/api/auth", userRoutes);

module.exports = app;
