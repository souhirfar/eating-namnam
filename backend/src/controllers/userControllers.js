// Import access to database tables

const jwt = require("jsonwebtoken");
const argon2 = require("argon2");
const tables = require("../tables");

// The B of BREAD - Browse (Read All) operation
const browse = async (req, res, next) => {
  try {
    // Fetch all items from the database
    const users = await tables.user.readAll();

    // Respond with the items in JSON format
    res.json(users);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

// The R of BREAD - Read operation
const read = async (req, res, next) => {
  try {
    // Fetch a specific item from the database based on the provided ID
    const user = await tables.user.read(req.params.id);

    // If the item is not found, respond with HTTP 404 (Not Found)
    // Otherwise, respond with the item in JSON format
    if (user == null) {
      res.sendStatus(404);
    } else {
      res.json(user);
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
const edit = async (req, res, next) => {
  const wantedId = parseInt(req.params.id, 10);
  // Extract the user data from the request body
  const item = req.body;
  item.id = wantedId;

  try {
    const user = await tables.user.update(item);
    // Respond with HTTP 201 (Created) and the ID of the newly inserted recipe
    res.status(200).json(user);
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};
// The E of BREAD - Edit (Update) operation
// This operation is not yet implemented

// The A of BREAD - Add (Create) operation
const add = async (req, res, next) => {
  // Extract the item data from the request body
  const user = req.body;

  try {
    const userExist = await tables.user.readUserByEmail(user.email);
    if (userExist.length === 0) {
      const insertId = await tables.user.create(user);
      const tokenUser = jwt.sign(
        { email: user.email, userId: insertId },
        process.env.APP_SECRET,
        { expiresIn: "1h" }
      );
      if (user.is_admin === true) {
        res.cookie("token", tokenUser, {
          httpOnly: true,
          maxAge: 3600000,
        });
        res.status(200).send({
          message: "Authentification réussie",
          is_admin: true,
          insertId,
        });
      } else {
        res.cookie("token", tokenUser, {
          httpOnly: true,
          maxAge: 3600000,
        });
        res.status(200).send({
          message: "Authentification réussie",
          is_admin: false,
          insertId,
        });
      }
    } else {
      res.status(200).send({
        message: "Cet email est indisponible",
      });
    }
  } catch (err) {
    // Pass any errors to the error-handling middleware
    next(err);
  }
};

const verifyToken = async (req, res, next) => {
  if (!req.cookies.token) {
    res.status(204).send({ message: "Not Conencted" });
  } else {
    const { token } = req.cookies;

    try {
      const decodedToken = jwt.verify(token, process.env.APP_SECRET);

      const { userId } = decodedToken;

      const checkUserToken = await tables.user.verifyToken(userId);

      if (
        checkUserToken.length === 1 &&
        checkUserToken[0].id === userId &&
        checkUserToken[0].is_admin === 1
      ) {
        res.status(200).send({
          message: "OK",
          admin: true,
          id: userId,
        });
      } else if (
        checkUserToken.length === 1 &&
        checkUserToken[0].id === userId &&
        checkUserToken[0].is_admin === 0
      ) {
        res.status(200).send({
          message: "OK",
          admin: false,
          id: userId,
        });
      } else res.status(200).send({ message: "Error" });
    } catch (err) {
      res.status(200).send({ message: err });
      next(err);
    }
  }
};
const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await tables.user.readUserByEmail(email);
    if (user.length === 1) {
      const verified = await argon2.verify(user[0].password, password);

      if (verified) {
        // Respond with the user and a signed token in JSON format (but without the hashed password)
        delete user.password;

        const tokenUser = jwt.sign(
          {
            email: user[0].email,
            userId: user[0].id,
          },
          process.env.APP_SECRET,
          { expiresIn: "1h" }
        );

        if (user[0].is_admin === 1) {
          res.cookie("token", tokenUser, {
            httpOnly: true,
            maxAge: 3600000,
          });
          res.status(200).send({
            message: "Authentification réussie",
            is_admin: true,
          });
        } else {
          res.cookie("token", tokenUser, {
            httpOnly: true,
            maxAge: 3600000,
          });
          res.status(200).send({
            message: "Authentification réussie",
            is_admin: false,
          });
        }
      } else {
        res.status(401).send({ message: "Mot de passe incorrect" });
      }
    } else {
      res
        .status(401)
        .send({ message: "Aucun compte n'a été trouvé avec cet email" });
    }
  } catch (err) {
    next(err);
  }
};
const logout = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (token) {
      res.clearCookie("token");
      res.status(200).json({ message: "Logged out successfully" });
    } else res.status(401).json({ error: "Internal error" });
  } catch (err) {
    res.status(401).json({ error: "Internal error" });
    next(err);
  }
};

// The D of BREAD - Destroy (Delete) operation
// This operation is not yet implemented

// Ready to export the controller functions
module.exports = {
  browse,
  read,
  edit,
  add,
  // destroy,
  login,
  verifyToken,
  logout,
};
