const {Router} = require("express");

const userController = require("./src/controllers/UserController");
const requestController = require("./src/controllers/RequestController");
const productsController = require("./src/controllers/ProductController");
const routes = new Router();

// Users
routes.get("/users", userController.index);
// routes.get("/users/:id", userController.getOneUser);
routes.put("/users/:id", userController.update);
routes.delete("/users/:id", userController.delete);

// Requests
routes.get("/requests", requestController.index);
routes.post("/requests", requestController.store);
routes.put("/requests/:id", requestController.update);
routes.delete("/requests/:id", requestController.delete);

// Products
routes.get("/products", productsController.index);
routes.post("/products", productsController.store);
routes.put("/products/:id", productsController.update);
routes.delete("/products/:id", productsController.delete);


module.exports = routes;
