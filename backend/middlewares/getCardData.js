const BankData = require('../models/bankDataModel');
const  _ = require('lodash');
const getCardData = async () => {
    let cvv = _.random(100,999);

    let digits16 = '';
    let isUniqueDig = false;

    while (!isUniqueDig){
        for (let i = 0; i < 4; i++) {
            digits16 += _.random(1000, 9999);  // Add 4 digits without space
        }
        const exists = await BankData.findOne({digits16});
        if (!exists) {
            isUniqueDig = true;
        }
    }
    return {cvv, digits16};
}

module.exports = getCardData;
