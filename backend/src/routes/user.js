const router = require('express').Router();

// middlewares
const { authVerify, isAdmin } =require("../middlewares/authVerifyMiddleware");
// controllers
const {
    register,
    login,
    updateProfile,
    getOrders,
    allOrders,
} =require("../controllers/user");

router.post("/register", register);
router.post("/login", login);
router.put("/profile", authVerify, updateProfile);


// Auth check route
router.get('/auth-check', authVerify, (_req, res)=>{
    res.status(200).json({ok: true});
});

// Admin check
router.get('/admin-check', authVerify, isAdmin, (_req, res)=>{
    res.status(200).json({ok: true});
});

// orders
router.get("/orders", authVerify, getOrders);
router.get("/all-orders", authVerify, isAdmin, allOrders);


module.exports = router;