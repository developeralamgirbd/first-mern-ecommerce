const {Schema, model} = require("mongoose");
const { ObjectId } = Schema.Types;

const orderSchema = new Schema({
        product: {
            type: ObjectId,
            ref: 'Product'
        },
        payment: {},
        buyer: {
            type: ObjectId,
            ref: 'User'
        },
        status: {
            type: String,
            default: 'Not processed',
            enum: [
                "Not processed",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ]
        }

    },
    { timestamps: true,versionKey:false }
);

module.exports = model('Order', orderSchema);