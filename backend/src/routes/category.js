const router = require('express').Router();

// middlewares
const { authVerify, isAdmin } =require("../middlewares/authVerifyMiddleware");
// controllers
const {
    create,
    update,
    remove,
    list,
    read,
    productsByCategory,
} =require("../controllers/category.js");

router.post("/category", authVerify, isAdmin, create);
router.put("/category/:categoryId", authVerify, isAdmin, update);
router.delete("/category/:categoryId", authVerify, isAdmin, remove);
router.get("/categories", list);
router.get("/category/:slug", read);
router.get("/products-by-category/:slug", productsByCategory);

module.exports= router;