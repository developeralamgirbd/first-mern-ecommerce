const router = require('express').Router();
const formidable = require('express-formidable');
// middlewares
const { authVerify, isAdmin } =require("../middlewares/authVerifyMiddleware");

// controllers
const {
    create,
    list,
    read,
    photo,
    remove,
    update,
    filteredProducts,
    productsCount,
    listProducts,
    productsSearch,
    relatedProducts,
    getToken,
    processPayment,
    orderStatus,
} =require("../controllers/product.js");

router.post("/product", authVerify, isAdmin, formidable(), create);
router.get("/products", list);
router.get("/product/:slug", read);
router.get("/product/photo/:productId", photo);
router.delete("/product/:productId", authVerify, isAdmin, remove);
router.put("/product/:productId", authVerify, isAdmin, formidable(), update);
router.post("/filtered-products", filteredProducts);
router.get("/products-count", productsCount);
router.get("/list-products/:page", listProducts);
router.get("/products/search/:keyword", productsSearch);
router.get("/related-products/:productId/:categoryId", relatedProducts);

router.get("/braintree/token", getToken);
router.post("/braintree/payment", authVerify, processPayment);
router.put("/order-status/:orderId", authVerify, isAdmin, orderStatus);

module.exports= router;