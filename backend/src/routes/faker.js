const {fakerUserCreate, fakerCategoryCreate, fakerProductCreate} = require("../controllers/fakerController/fakerUserController");
const router = require('express').Router();


router.get('/faker-users', fakerUserCreate);
router.get('/faker-categories', fakerCategoryCreate);
router.post('/faker-products', fakerProductCreate);

module.exports = router;