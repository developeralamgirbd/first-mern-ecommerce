const Product = require('../models/Product');
const fs = require("fs");
const slugify = require("slugify");
const braintree = require("braintree");
require("dotenv").config();
const Order = require("../models/Order");
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

const gateway = new braintree.BraintreeGateway({
    environment: braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANT_ID,
    publicKey: process.env.BRAINTREE_PUBLIC_KEY,
    privateKey: process.env.BRAINTREE_PRIVATE_KEY,
});


exports.create = async (req, res) => {
    try {
        // console.log(req.fields);
        // console.log(req.files);
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name.trim():
                return res.status(400).json({ error: "Name is required" });
            case !description.trim():
                return res.status(400).json({ error: "Description is required" });
            case !price.trim():
                return res.status(400).json({ error: "Price is required" });
            case !category.trim():
                return res.status(400).json({ error: "Category is required" });
            case !quantity.trim():
                return res.status(400).json({ error: "Quantity is required" });
            case !shipping.trim():
                return res.status(400).json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
                return res.status(400).json({ error: "Image should be less than 1mb in size" });
        }

        // create product
        const product = new Product({ ...req.fields, slug: slugify(name) });

        if (photo) {
            /*console.log(fs.readFileSync(photo.path));
            console.log(photo.type)*/
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(201).json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err.message);
    }
};

/**
 * get all product
*/
exports.list = async (req, res) => {
    try {
        const products = await Product.find({})
            .populate("category")
            .select("-photo")
            .limit(12)
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json(err.message)
    }
};
/**
 * Get one product by slug with category populate and without photo
*/
exports.read = async (req, res) => {
    try {
        const product = await Product.findOne({ slug: req.params.slug })
            .select("-photo")
            .populate("category");

        res.json(product);
    } catch (err) {
        console.log(err);
    }
};

/**
 * Only Get one product photo by ID
 */
exports.photo = async (req, res) => {
    try {
        const product = await Product.findById(req.params.productId).select(
            "photo"
        );
        // set photo content type in header content type
        if (product.photo.data) {
            res.set("Content-Type", product.photo.contentType);
            return res.send(product.photo.data);
        }
    } catch (err) {
        console.log(err);
    }
};

/**
 * Delete one product by ID
 */
exports.remove = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(
            req.params.productId
        ).select("-photo");
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message})
    }
};

/**
 * Update a product by ID
 */
exports.update = async (req, res) => {
    try {
        // console.log(req.fields);
        // console.log(req.files);
        const { name, description, price, category, quantity, shipping } =
            req.fields;
        const { photo } = req.files;

        // validation
        switch (true) {
            case !name.trim():
               return res.status(400).json({ error: "Name is required" });
            case !description.trim():
               return res.status(400).json({ error: "Description is required" });
            case !price.trim():
               return res.status(400).json({ error: "Price is required" });
            case !category.trim():
               return res.status(400).json({ error: "Category is required" });
            case !quantity.trim():
               return res.status(400).json({ error: "Quantity is required" });
            case !shipping.trim():
               return res.status(400).json({ error: "Shipping is required" });
            case photo && photo.size > 1000000:
               return res.status(400).json({ error: "Image should be less than 1mb in size" });
        }

        // update product
        const product = await Product.findByIdAndUpdate(
            req.params.productId,
            {
                ...req.fields,
                slug: slugify(name),
            },
            { new: true, runValidators: true }
        );

        if (photo) {
            product.photo.data = fs.readFileSync(photo.path);
            product.photo.contentType = photo.type;
        }

        await product.save();
        res.status(200).json(product);
    } catch (err) {
        console.log(err);
        return res.status(500).json(err.message);
    }
};

/**
 * Product filter by category and price
 */
exports.filteredProducts = async (req, res) => {
    try {
        const { checked, radio } = req.body;

        let args = {};
        if (checked.length > 0) args.category = checked;
        if (radio.length) args.price = { $gte: radio[0], $lte: radio[1] };
        console.log("args => ", args);

        const products = await Product.find(args);
        console.log("filtered products query => ", products.length);
        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

/**
 * Total Product count
 */
exports.productsCount = async (req, res) => {
    try {
        const total = await Product.find({}).estimatedDocumentCount();
        res.status(200).json(total);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

/**
 * Product pagination
 */
exports.listProducts = async (req, res) => {
    try {
        const perPage = 6;
        const page = req.params.page ? req.params.page : 1;

        const products = await Product.find({})
            .select("-photo")
            .skip((page - 1) * perPage)
            .limit(perPage)
            .sort({ createdAt: -1 });

        res.status(200).json(products);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

/**
 * Search Product by name and description
 */
exports.productsSearch = async (req, res) => {
    try {
        const { keyword } = req.params;
        const results = await Product.find({
            $or: [
                { name: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ],
        }).select("-photo");

        res.json(results);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};

/**
 * get related products by present product category id and present product id skip
 */
exports.relatedProducts = async (req, res) => {
    try {
        const { productId, categoryId } = req.params;
        const related = await Product.find({
            category: categoryId,
            _id: { $ne: productId },
        })
            .select("-photo")
            .populate("category")
            .limit(3);

        res.status(200).json(related);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};


exports.getToken = async (req, res) => {
    try {
        gateway.clientToken.generate({}, function (err, response) {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.send(response);
            }
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};


exports.processPayment = async (req, res) => {
    try {
        // console.log(req.body);
        const { nonce, cart } = req.body;

        let total = 0;
        cart.map((i) => {
            total += i.price;
        });
        // console.log("total => ", total);

        let newTransaction = gateway.transaction.sale(
            {
                amount: total,
                paymentMethodNonce: nonce,
                options: {
                    submitForSettlement: true,
                },
            },
            function (error, result) {
                if (result) {
                    // res.send(result);
                    // create order
                    const order = new Order({
                        products: cart,
                        payment: result,
                        buyer: req.user._id,
                    }).save();
                    // decrement quantity
                    decrementQuantity(cart);
                    // const bulkOps = cart.map((item) => {
                    //   return {
                    //     updateOne: {
                    //       filter: { _id: item._id },
                    //       update: { $inc: { quantity: -0, sold: +1 } },
                    //     },
                    //   };
                    // });

                    // Product.bulkWrite(bulkOps, {});

                    res.status(200).json({ ok: true });
                } else {
                    res.status(500).json({error: error.message});
                }
            }
        );
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});

    }
};


const decrementQuantity = async (cart) => {
    try {
        // build mongodb query
        const bulkOps = cart.map((item) => {
            return {
                updateOne: {
                    filter: { _id: item._id },
                    update: { $inc: { quantity: -0, sold: +1 } },
                },
            };
        });

        const updated = await Product.bulkWrite(bulkOps, {});
        console.log("blk updated", updated);
    } catch (err) {
        console.log(err);
    }
};

/**
 * Order status update
 */
exports.orderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate("buyer", "email name");
        // send email

        // prepare email
        const emailData = {
            from: process.env.EMAIL_FROM,
            to: order.buyer.email,
            subject: "Order status",
            html: `
        <h1>Hi ${order.buyer.name}, Your order's status is: <span style="color:red;">${order.status}</span></h1>
        <p>Visit <a href="${process.env.CLIENT_URL}/dashboard/user/orders">your dashboard</a> for more details</p>
      `,
        };

        try {
            await sgMail.send(emailData);
        } catch (err) {
            console.log(err);
        }

        res.status(200).json(order);
    } catch (err) {
        console.log(err);
        res.status(500).json({error: err.message});
    }
};



