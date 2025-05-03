const BankData = require('../models/bankDataModel');

const getAccountID = async (prefix = 'SOUL', length = 12) => {
    let isUnique = false;
    let newID;

    while (!isUnique) {
        const timestamp = Date.now().toString().slice(-6);
        const randomPart = Math.random().toString().slice(2, 2 + (length - prefix.length - timestamp.length));
        newID = `${prefix}${timestamp}${randomPart}`;

        const exists = await BankData.findOne({ accountId: newID });
        if (!exists) {
            isUnique = true;
        }
    }
    return newID;
};

module.exports = getAccountID;