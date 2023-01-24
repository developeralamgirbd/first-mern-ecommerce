const {Schema, model} = require("mongoose");
const { ObjectId } = Schema.Types;

const productSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            maxLength: 160,
            minLength: 2
        },
        slug: {
            type: String,
            trim: true,
            required: true,
            lowercase: true
        },
        description: {
            type: {},
            required: true,
            maxlength: 2000,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        category: {
            type: ObjectId,
            ref: "Category",
            required: true,
        },
        quantity: {
            type: Number,
        },
        sold: {
            type: Number,
            default: 0,
        },
        photo: {
            data: Buffer,
            contentType: String,
        },
        demoPhoto: {
            type: String
        },
        shipping: {
            required: false,
            type: Boolean,
        },

    },
    { timestamps: true,versionKey:false }
);

module.exports = model('Product', productSchema);