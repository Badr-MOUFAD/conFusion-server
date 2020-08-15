const express = require("express");
const bodyParser = require("body-parser");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "text/plain");
        next();
    })
    .get((req, res, next) => {
        res.end("Dishes will be sent to you");
    })
    .post((req, res, next) => {
        res.end(`Dish with name: ${req.body.name} and description: ${req.body.description} \nwill be added`);
    })
    .put((req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete((req, res, next) =>{
        res.end("All Dishes will be deleted");
    });

dishRouter.route("/:dishId")
    .get((req, res, next) => {
        res.end(`Dish with id: ${req.params.dishId} will be sent to you`);
    })
    .put((req, res, next) => {
        res.end(`Dish with id: ${req.params.dishId} will be updated to name: ${req.body.name} and description: ${req.body.description}`);
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within ${req.params.dishId}`);
    })
    .delete((req, res, next) => {
        res.end(`Dish with id: ${req.params.dishId} will be deleted`)
    });

module.exports = dishRouter;