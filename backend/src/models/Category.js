const {Schema, model} = require("mongoose");

const categorySchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            maxLength: 32,
            minLength: 2
        },
        slug: {
            type: String,
            trim: true,
            required: true,
            unique: true,
            lowercase: true
        }

    },
    { timestamps: true,versionKey:false }
);

module.exports = model('Category', categorySchema);