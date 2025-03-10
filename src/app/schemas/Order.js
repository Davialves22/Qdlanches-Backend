const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
    {
        user: {
            id: {
                type: String,
                require: true,
            },
            name: {
                type: String,
                require: true
            },
        },
        products: [
            {
                id: {
                    type: Number,
                    require: true
                },
                name: {
                    type: String,
                    require: true
                },
                price: {
                    type: Number,
                    require: true
                },
                category: {
                    type: String,
                    require: true,
                },

                url: {
                    type: String,
                    require: true
                },
                quantity: {
                    type: Number,
                    require: true
                },
            },
        ],
        status: {
            type: String,
            require: true
        },
    },
    {
        timestamps: true,
    },
)

module.exports = mongoose.model('Order', OrderSchema);