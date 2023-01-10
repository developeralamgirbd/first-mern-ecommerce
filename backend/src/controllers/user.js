const User = require('../models/User');
const Order = require('../models/Order');
const {makeHash, createToken, comparePassword} = require("../helpers/authHelper");

exports.register = async (req, res) => {
    try {
        // 1. destructure name, email, password from req.body
        const { name, email, password } = req.body;
        // if name is empty after trim
        if (!name.trim()){
            return res.status(400).json({
                status: 'fail',
                error: 'Name is required'
            })
        }
        // if email is empty
        if (!email){
            return res.status(400).json({
                status: 'fail',
                error: 'Email is required'
            })
        }
        // if email not valid
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
            return res.status(400).json({
                status: 'fail',
                error: 'Please provide valid email address'
            })
        }
        if (!password || password.length < 6) {
            return res.status(400).json({ error: "Password must be at least 6 characters long" });
        }
        // if user exits
       const userExit = await User.findOne({email});
        if (userExit){
            return res.status(400).json({ error: "Email is taken" });
        }

        const hashPassword = await makeHash(password);

       const user = await new User({
            name,
            email,
            password: hashPassword
        }).save();

        const token = createToken(user);

        res.status(201).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token
        })

    }catch (error) {
        console.log(error)
    }
}

exports.login = async (req, res) => {
    try {
        // 1. destructure name, email, password from req.body
        const { email, password } = req.body;
        // 2. all fields require validation
        if (!email) {
            return res.json({ error: "Email is required" });
        }
        if (!password || password.length < 6) {
            return res.json({ error: "Password must be at least 6 characters long" });
        }
        // 3. check if email is taken
        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ error: "User not found" });
        }
        // 4. compare password
        const match = await comparePassword(password, user.password);
        if (!match) {
            return res.json({ error: "Wrong password" });
        }
        // 5. create signed jwt

        const token = createToken(user);

        // 7. send response
        res.status(200).json({
            user: {
                name: user.name,
                email: user.email,
                role: user.role,
                address: user.address,
            },
            token,
        });
    } catch (err) {
        console.log(err);
    }
};


exports.updateProfile = async (req, res) => {
    try {
        const { name, password, address } = req.body;
        const user = await User.findById(req.user._id);
        // check password length
        if (password && password.length < 6) {
            return res.json({
                error: "Password is required and should be min 6 characters long",
            });
        }
        // hash the password
        const hashedPassword = password ? await makeHash(password) : undefined;

        const updated = await User.findByIdAndUpdate(
            req.user._id,
            {
                name: name || user.name,
                password: hashedPassword || user.password,
                address: address || user.address,
            },
            { new: true }
        );

        updated.password = undefined;
        res.status(201).json({
            status: 'success',
            user: updated
        });
    } catch (err) {
        console.log(err);
    }
};

exports.getOrders = async (req, res) => {
    try {
        const orders = await Order.find({ buyer: req.user._id })
            .populate("products", "-photo")
            .populate("buyer", "name");
        res.status(200).json(orders);
    } catch (err) {
        console.log(err);
    }
};

exports.allOrders = async (req, res) => {
    try {
        const orders = await Order.find({})
            .populate("products", "-photo")
            .populate("buyer", "name")
            .sort({ createdAt: "-1" });
        res.status(200).json(orders);
    } catch (err) {
        console.log(err);
    }
};