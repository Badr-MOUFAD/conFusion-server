const express = require("express");
const bodyParser = require("body-parser");

const Dishes = require("../models/dishes");
const authenticate = require("../authentication");

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
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.create(req.body)
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .put(authenticate.verifyUser, (req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete(authenticate.verifyUser, (req, res, next) =>{
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
    .put(authenticate.verifyUser, (req, res, next) => {
        Dishes.findByIdAndUpdate(req.params.dishId, { $set: req.body }, { new: true })
            .then((dish) => {
                res.statusCode = 200;
                res.json(dish);
            })
            .catch((err) => {
                console.log(err.message);
            });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`The POST operation is not allowed within ${req.params.dishId}`);
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
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
            .then((dish) => {
                if(dish) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                
                next(new Error(`dish with id: ${req.params.dishId} doses not exist`));
            })
            .catch((err) => {
                next(err);
            });
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish) {
                    dish.comments.push(req.body);  
                    return dish.save()                   
                }

                next(new Error(`dish with id: ${req.params.dishId} doses not exist`));
            })
            .then((newDish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(newDish);
            })
            .catch((err) => {
                next(err)
            });
    })
    .put(authenticate.verifyUser, (req, res, next) =>{
        res.statusCode = 403;
        res.end("PUT method is not supported");
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish) {
                    dish.comments = [];
                    return dish.save();                  
                }

                next(new Error(`dish with id: ${req.params.dishId} doses not exist`));
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
            .then((dish) => {
                if(dish && dish.comments.id(req.params.commentId)) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));                 
                }

                next(new Error(`dish with id: ${req.params.dishId} doses not exist`));
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
                if(dish && dish.comments.id(req.params.commentId)) {
                    const comment = dish.comments.id(req.params.commentId);
                    
                    if(req.body.rating) {
                        comment.rating = req.body.rating; 
                    }

                    if(req.body.comment) {
                        comment.comment = req.body.comment;
                    }

                    return dish.save();
                }

                next(new Error(`dish with id: ${req.params.dishId} doses not exist`));
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
    .delete(authenticate.verifyUser, (req, res, next) => {
        Dishes.findById(req.params.dishId)
            .then((dish) => {
                if(dish && dish.comments.id(req.params.commentId)) {
                    dish.comments.id(req.params.commentId).remove();
                    
                    return dish.save();
                }

                next(new Error(`dish with id: ${req.params.dishId} doses not exist`));
            })
            .then((newDish) => {
                res.statusCode = 200;
                res.json(newDish);
            })
            .catch((err) => {
                next(err);
            });
    });

module.exports = dishRouter;