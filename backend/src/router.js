const express = require("express");

const router = express.Router();

/* ************************************************************************* */
// Define Your API Routes Here
/* ************************************************************************* */
const { hashPassword } = require("./services/auth");
// Import itemControllers module for handling item-related operations
const userControllers = require("./controllers/userControllers");

// Route to get a list of items
router.get("/users", userControllers.browse);

// Route to get a specific item by ID
router.get("/users/:id", userControllers.read);

// Route to add a new item
router.post("/users", hashPassword, userControllers.add);
router.post("/login", userControllers.login);
router.get("/verify-token", userControllers.verifyToken);
router.put("/users/:id", userControllers.edit);
router.get("/logout", userControllers.logout);
/* ************************************************************************* */

module.exports = router;
