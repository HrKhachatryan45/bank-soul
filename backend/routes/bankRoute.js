const express = require('express');
const protectRoute = require('../middlewares/protectRoute');
const {addBalance, printFile, addCard, addToCardBalance, addMoneyToCard, addToAccount, deleteTransactions, getLoan,
    payLoan
} = require("../controllers/bankController");
const router = express.Router();

    router.post('/addBalance',protectRoute,addBalance);
    router.get('/printFile',protectRoute,printFile);
    router.post('/addCard',protectRoute,addCard)
    router.post('/addToCardBalance',protectRoute,addToCardBalance)
    router.post('/addMoneyToCard',protectRoute,addMoneyToCard)
    router.post('/addToAccount',protectRoute,addToAccount)
    router.post('/deleteTransactions',protectRoute,deleteTransactions)
    router.post('/getLoan',protectRoute,getLoan)
    router.post('/payLoan',protectRoute,payLoan)

module.exports = router;