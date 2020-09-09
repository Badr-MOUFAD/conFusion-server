const Mongoose = require("mongoose");
require('mongoose-currency').loadType(Mongoose);

const Currency = Mongoose.Types.Currency;

const Schema = Mongoose.Schema;

const commentSchema = new Schema({
    author: {
        type: Mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    comment: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: true
    }
}, { timestamps: true });

const dishSchema = new Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ""
    },
    price: {
        type: Currency,
        required: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    comments: [commentSchema]
    
}, {timestamps: true});

const Dishes = Mongoose.model("Dish", dishSchema);

module.exports = Dishes;