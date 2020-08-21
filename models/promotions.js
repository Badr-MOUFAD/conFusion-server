const Mongoose = require("mongoose");
require('mongoose-currency').loadType(Mongoose);

const Currency = Mongoose.Types.Currency;


const promotionSchema = new Mongoose.Schema({
    name: {
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
        required: true,
        min: 0
    },
    description: {
        type: String,
        default: ""
    },
    featured: {
        type: Boolean,
        default: false
    }
}, { timestamps: true});

const Promotions = Mongoose.model("Promotion", promotionSchema);

module.exports = Promotions;