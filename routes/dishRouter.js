const express = require("express");
const bodyParser = require("body-parser");

const Dishes = require("../models/dishes");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
    .get((req, res, next) => {
        Dishes.find({})
            .then((dishes) => {
                res.statusCode = 200;
                res.json(dishes);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .post((req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .put((req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete((req, res, next) =>{
        Dishes.remove({})
            .then(() => {
                res.end("All dishes were deleted");
            })
            .catch((err) => {
                console.log(err.message);
            });
    });

dishRouter.route("/:dishId")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .put((req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true})
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within ${req.params.dishId}`);
    })
    .delete((req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((dish) => {
                res.end(`Dish with id: ${req.params.dishId} was successfully deleted`);
            })
            .catch((err) => {
                console.log(err.message);
            });
    });

module.exports = dishRouter;