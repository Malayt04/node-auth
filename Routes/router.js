const express = require('express');
const {getSignUpPage,postLogin,getLoginPage,postSignUp,getLogoutPage}=require('../controller/controllers');

const router=express.Router();

router.route('/signUp').get(getSignUpPage).post(postSignUp);
router.route('/logIn').get(getLoginPage).post(postLogin);
router.route('/logout').get(getLogoutPage);

module.exports = router;
