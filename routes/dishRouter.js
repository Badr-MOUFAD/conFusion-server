const express = require("express");
const bodyParser = require("body-parser");

const Dishes = require("../models/dishes");
const authenticate = require("../authentication");

const dishRouter = express.Router();

dishRouter.use(bodyParser.json());

dishRouter.route("/")
    .get((req, res, next) => {
        Dishes.find({})
            .populate("comments.author")
            .then((dishes) => {
                res.statusCode = 200;
                res.json(dishes);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .post(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .put(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) =>{
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
            .populate("comments.author")
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .put(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .post(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within ${req.params.dishId}`);
    })
    .delete(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Dishes.findByIdAndRemove(req.params.dishId)
            .then((dish) => {
                res.end(`Dish with id: ${req.params.dishId} was successfully deleted`);
            })
            .catch((err) => {
                console.log(err.message);
            });
    });

dishRouter.route("/:dishId/comments")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate("comments.author")
            .then((dish) => {
                if(dish) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                
                throw new Error(`dish with id: ${req.params.dishId} doses not exist`);
            })
            .catch((err) => {
                next(err);
            });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish) {
                    req.body.author = req.user._id;
                    dish.comments.push(req.body);  
                    return dish.save();                  
                }

                throw new Error(`dish with id: ${req.params.dishId} doses not exist`);
            })
            .then((newDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newDish);
            })
            .catch((err) => {
                next(err);
            });
    })
    .put(authenticate.verifyUser, (req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete(authenticate.verifyUser, authenticate.vertifyAdmin, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish) {
                    dish.comments = [];
                    return dish.save();                  
                }

                throw new Error(`dish with id: ${req.params.dishId} doses not exist`);
            })
            .then((newDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newDish);
            })
            .catch((err) => {
                next(err);
            });
    });

dishRouter.route("/:dishId/comments/:commentId")
    .get((req, res, next) => {
        Dishes.findById(req.params.dishId)
            .populate("comments.author")
            .then((dish) => {
                if(dish && dish.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));                 
                }

                throw new Error(`dish with id: ${req.params.dishId} doses not exist`);
            })
            .catch((err) => {
                next(err);
            });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end("POST method is not supported");
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(!dish) {
                    throw new Error("Dish doesn t exist");
                }
                if (!dish.comments.id(req.params.commentId)) {
                    throw new Error("dish doesn t have this comment");
                }
                if(req.user._id !== dish.comments.id(req.params.commentId).author.toString()) {
                    throw new Error("Users can only modify their own comments");
                }
                
                if(req.body.comment) {
                    dish.comments.id(req.params.commentId).comment = req.body.comment;
                }
                if(req.body.rating) {
                    dish.comments.id(req.params.commentId).rating = req.body.rating;
                }
                
                return dish.save();
            })
            .then((newDish) => {                
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(newDish);
            })
            .catch((err) => {
                next(err);
            });
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(!dish) {
                    throw new Error("Dish doesn t exist");
                }
                if (!dish.comments.id(req.params.commentId)) {
                    throw new Error("dish doesn t have this comment");
                }
                if(req.user._id !== dish.comments.id(req.params.commentId).author.toString()) {
                    throw Error("Users can only delete their own comments");
                }

                dish.comments.id(req.params.commentId).remove();
                    
                return dish.save();
            })
            .then((newDish) => {                
                res.statusCode = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(newDish);
            })
            .catch((err) => {
                next(err);
            });
    });

module.exports = dishRouter;