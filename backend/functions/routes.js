/* eslint-disable max-len */
const {Router} = require("express");

const userController = require("./src/controllers/UserController");
const requestController = require("./src/controllers/RequestController");
const requestsByStatusController = require("./src/controllers/RequestsByStatusController");
const requestsByStatusByUserController = require("./src/controllers/RequestsByStatusByUserController");
const productsController = require("./src/controllers/ProductController");
const uniqProductController = require("./src/controllers/UniqueProductController");
const commentsController = require("./src/controllers/CommentController");
const sessionsController = require("./src/controllers/SessionController");

const authMiddleware = require("./src/middlewares/auth");

const routes = new Router();

// Create User
routes.post("/users", userController.store);

// Session
routes.post("/sessions/", sessionsController.store);

routes.use(authMiddleware);

// Users
routes.get("/users", userController.index);
// routes.get("/users/:id", userController.getOneUser);
routes.put("/users/:id", userController.update);
routes.delete("/users/:id", userController.delete);

// Requests
routes.get("/requests", requestController.index);
routes.get("/requests/:userId/:status", requestsByStatusByUserController.index);
routes.get("/requests/:status", requestsByStatusController.index);
routes.post("/requests", requestController.store);
routes.put("/requests/:id", requestController.update);
routes.delete("/requests/:id", requestController.delete);

// Products
routes.get("/products", productsController.index);
routes.get("/products/:id", uniqProductController.index);
routes.post("/products", productsController.store);
routes.put("/products/:id", productsController.update);
routes.delete("/products/:id", productsController.delete);

// Comments
routes.get("/comments/request/:id", commentsController.index);
routes.post("/comments/request/:id", commentsController.store);
routes.delete("/comments/", commentsController.delete);


module.exports = routes;
