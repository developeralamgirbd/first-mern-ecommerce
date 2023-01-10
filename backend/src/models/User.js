const {Schema, model} = require("mongoose");

const userSchema = new Schema({
        name: {
            type: String,
            trim: true,
            required: true,
        },
        email: {
            type: String,
            trim: true,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true,
            minLength: 6,
            maxLength: 64,
        },
        address: {
            type: String,
            trim: true,
        },
        role: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true,versionKey:false }
);

module.exports = model('User', userSchema);