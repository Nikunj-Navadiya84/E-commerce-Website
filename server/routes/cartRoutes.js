const express = require("express");

const { userMiddleware } = require ('../middleware/UserMiddleware.js');
const { addcart, updatecart, getUsercart } = require("../controllers/cartController.js");


const router = express.Router()

router.post('/get',userMiddleware, getUsercart)
router.post('/add',userMiddleware, addcart)
router.post('/update',userMiddleware, updatecart)

module.exports = router;