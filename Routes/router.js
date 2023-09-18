const express = require('express');
const {getSignUpPage,postLogin,getLoginPage,postSignUp}=require('../controller/controllers');

const router=express.Router();

router.route('/signUp').get(getSignUpPage).post(postSignUp);
router.route('/logIn').get(getLoginPage).post(postLogin);

module.exports = router;
