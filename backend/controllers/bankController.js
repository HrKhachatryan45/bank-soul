const PDFDocument = require('pdfkit');
const BankData = require('../models/bankDataModel');
const getCardData  = require('../middlewares/getCardData')
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const {getReceiverSocketId,io} = require("../socket/socket");
const addBalance = async (req, res) => {
    try {
        const {amount} = req.body;
        const  user = req.user;
        const bankID = user.bankData;
        const bankUserData = await BankData.findById(bankID)

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];


        const day = new Date().getDate();
        const monthIndex = new Date().getMonth();
        const year = new Date().getFullYear();




        if (amount <= 0){
            return res.status(400).json({error:"Enter positive number"});
        }

        const date = `${day} ${months[monthIndex]},${year}`;

        const transaction = {
            date,
            amount,
            receiver:user._id,
            sender:user._id,
            status:"completed",
            isAdded:true,
        }




        bankUserData.balance.bankAccount.balance += amount;
        bankUserData.transactions.push(transaction);
        await  bankUserData.save()

        const updatedUser = await User.findById(user._id).
        populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        })


        return res.status(200).json(updatedUser);


    }catch(err) {
        console.log(err)
        throw new Error(err.message);
    }
}

const printFile = async (req,res) => {
    try {
        const user = req.user;

        const populatedUser = await User.findById(user._id)
            .populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User',
                select: '-password'
            }
        })

        const  info = populatedUser.bankData.transactions;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=transactions.pdf');

        // Create PDF and stream to response
        const doc = new PDFDocument();
        doc.pipe(res); // Pipe to response, not file

        doc.fontSize(18).text('Transaction History', { align: 'center' }).moveDown();

        info.forEach(tx => {
            doc
                .fontSize(12)
                .text(`Date: ${tx.date}`)
                .text(`Amount: $${tx.amount}`)
                .text(`Sender: ${tx.sender?.username || 'N/A'}`)
                .text(`Receiver: ${tx.receiver?.username || 'N/A'}`)
                .text(`Status: ${tx.status}`)
                .moveDown();
        });

        doc.end();
    }catch(err){
        console.log(err)
        return  res.status(500).json({error:err.message});
    }
}

const addCard = async (req, res) => {
    try {
        const {color,password,phoneNumber,validYear,title} = req.body;
         const  user = req.user;

        const match = await bcrypt.compare(password,user.password);
         if (!match){
             return res.status(400).json({error:"Incorrect password"});
         }

         const userBankData =await BankData.findById(user.bankData);


         const year = new Date().getFullYear() + validYear;
         const month= new Date().getMonth();

        const {cvv,digits16} =await getCardData();


        console.log(year);
        console.log(year)
         const card = {
             fullName:user.fname.toUpperCase() + " " + user.lname.toUpperCase(),
             color,
             title,
             balance:0,
             expDate:`${month.toString().padStart(2,0)}/${year.toString().substring(2,4)}`,
             phoneNumber,
             cvv,
             digits16
         }
        console.log(userBankData)

         userBankData.balance.cards.push(card);

         await userBankData.save()

        const updatedUser = await User.findById(user._id).
        populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        })

        return res.status(200).json(updatedUser);
    }catch(err){
        console.log(err)
    }
}

const addToCardBalance = async (req, res) => {
    try {
        const  user = req.user;
        const {amount,digits16,cardSenderDigits16} = req.body;

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];



        const day = new Date().getDate();
        const monthIndex = new Date().getMonth();
        const year = new Date().getFullYear();


        console.log(amount)
        console.log(cardSenderDigits16)

        if (amount <= 0){
            return res.status(400).json({error:"Enter positive number"});
        }

        const date = `${day} ${months[monthIndex]},${year}`;

        let receiverId = '';

        if (cardSenderDigits16){

            const bankReceiverData = await BankData.findOne({ "balance.cards.digits16": digits16.trim() });
            if (!bankReceiverData){
                return res.status(400).json({error:"Card data is incorrect"})
            }
            const ID = bankReceiverData._id
            const userD = await User.findOne({bankData:ID});
            receiverId = userD._id;
        }else {
            receiverId = user._id
        }

        console.log(receiverId,'rec')

        const transactionSender = {
            date,
            amount,
            receiver:receiverId,
            sender:user._id,
            status:"completed",
            isAdded:false,
        }
        const transactionReceiver = {
            date,
            amount,
            receiver:receiverId,
            sender:user._id,
            status:"completed",
            isAdded:true,
        }

        if (cardSenderDigits16 === '' || cardSenderDigits16 == null) {
            const bankSenderData = await BankData.findById(user.bankData);


            const cardSenderBalance = bankSenderData.balance.bankAccount.balance

            if (cardSenderBalance < amount){
                transactionReceiver.status = "failed";
                bankSenderData.transactions.push(transactionSender)
                await bankSenderData.save()
               return res.status(400).json({error:"Insufficient funds"})
            }else {

                const bankReceiverData = await BankData.findOne({'balance.cards.digits16':digits16.trim()});
                if (!bankReceiverData){
                    return res.status(400).json({error:"Card data is incorrect"})
                }
                 bankSenderData.balance.bankAccount.balance -= amount;



                const card = bankReceiverData.balance.cards.find((card) => card.digits16 === digits16)
                card.balance += amount;
                bankSenderData.transactions.push(transactionSender)
                bankReceiverData.transactions.push(transactionReceiver)
                await bankSenderData.save()
                await bankReceiverData.save()

                const receiverUser = await User.findOne({bankData:bankReceiverData._id})

                const receiverSocketID =  getReceiverSocketId(receiverUser._id);

                console.log(receiverSocketID,'ID');

                const updatedReceiverUser = await User.findById(receiverUser._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })

                io.to(receiverSocketID).emit('updateUser',updatedReceiverUser)

                const updatedUser = await User.findById(user._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })


                return res.status(200).json(updatedUser);
            }
        }else {
            const bankSenderData = await BankData.findOne({ "balance.cards.digits16": cardSenderDigits16.trim() });

            const bankReceiverData = await BankData.findOne({ "balance.cards.digits16": digits16.trim() });

            if (!bankReceiverData){
                return res.status(400).json({error:"Card data is incorrect"})
            }

            const cardSenderBalance = bankSenderData.balance.cards.find((card) => card.digits16 === cardSenderDigits16).balance




            if (cardSenderBalance < amount){
                transactionSender.status = "failed";
                bankSenderData.transactions.push(transactionSender)
                await bankSenderData.save()

                return res.status(400).json({error:"Insufficient funds"})

            }else {
                const senderCard = bankSenderData.balance.cards.find((card) => card.digits16 ===cardSenderDigits16)

                senderCard.balance -= amount;

                const card = bankReceiverData.balance.cards.find((card) => card.digits16 === digits16)
                card.balance += amount;
                bankReceiverData.transactions.push(transactionReceiver)
                bankSenderData.transactions.push(transactionSender)

                await bankSenderData.save()
                await bankReceiverData.save()

                const receiverUser = await User.findOne({bankData:bankReceiverData._id})

                const receiverSocketID =  getReceiverSocketId(receiverUser._id);

                console.log(receiverSocketID,'ID');

                const updatedReceiverUser = await User.findById(receiverUser._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })

                io.to(receiverSocketID).emit('updateUser',updatedReceiverUser)


                const updatedUser = await User.findById(user._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })


                return res.status(200).json(updatedUser);
            }
        }
    }catch(err) {
        console.log(err)
        throw new Error(err.message);
    }
}
const addMoneyToCard = async (req, res) => {
    try {
        const {amount,digits16} = req.body;
        const  user = req.user;
        const bankID = user.bankData;
        const bankUserData = await BankData.findById(bankID)

        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];


        const day = new Date().getDate();
        const monthIndex = new Date().getMonth();
        const year = new Date().getFullYear();




        if (amount <= 0){
            return res.status(400).json({error:"Enter positive number"});
        }

        const date = `${day} ${months[monthIndex]},${year}`;

        const transaction = {
            date,
            amount,
            receiver:user._id,
            sender:user._id,
            status:"completed",
            isAdded:true,
        }


        console.log(digits16)

      let card5 = bankUserData.balance.cards.find((card) => card.digits16 === digits16);
        console.log(card5)
        card5.balance += amount;


        bankUserData.transactions.push(transaction);
        await  bankUserData.save()

        const updatedUser = await User.findById(user._id).
        populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        })


        return res.status(200).json(updatedUser);


    }catch(err) {
        console.log(err)
        throw new Error(err.message);
    }
}

const addToAccount = async (req,res) => {
    try {
        const {amount,digits16,accountID} = req.body;
        const  user = req.user;
        const bankID = user.bankData;
        const bankUserData = await BankData.findById(bankID)
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];


        const day = new Date().getDate();
        const monthIndex = new Date().getMonth();
        const year = new Date().getFullYear();




        if (amount <= 0){
            return res.status(400).json({error:"Enter positive number"});
        }

        const date = `${day} ${months[monthIndex]},${year}`;

        let receiverId = '';

        if (accountID){

            const bankReceiverData = await BankData.findOne({'balance.bankAccount.accountID':accountID});
            if (!bankReceiverData){
                return  res.status(400).json({error:"Incorrect account ID"})
            }
            const ID = bankReceiverData._id
            const userD = await User.findOne({bankData:ID});
            receiverId = userD._id;
        }else {
            receiverId = user._id
        }


        const transactionSender = {
            date,
            amount,
            receiver:receiverId,
            sender:user._id,
            status:"completed",
            isAdded:false,
        }
        const transactionReceiver = {
            date,
            amount,
            receiver:receiverId,
            sender:user._id,
            status:"completed",
            isAdded:true,
        }


        console.log(accountID)
        if (!accountID){
            console.log(accountID)
            let card =  bankUserData.balance.cards.find((card) => card.digits16 === digits16);
            if (!card) {
                return res.status(400).json({ error: "Card not found" });
            }
            if (amount > card.balance){
                transactionSender.status = "failed";

                bankUserData.transactions.push(transactionSender);

                await bankUserData.save()

                return res.status(400).json({error:"Insufficient funds"})

            }else {
                card.balance -= amount;
                bankUserData.balance.bankAccount.balance += amount;
                bankUserData.transactions.push(transactionSender);
                await bankUserData.save()

                const updatedUser = await User.findById(user._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })


                return res.status(200).json(updatedUser);
            }
        }else{
            const bankReceiverData = await BankData.findOne({'balance.bankAccount.accountID':accountID});
            console.log(bankReceiverData)
            let accountBalance =  bankUserData.balance.bankAccount.balance;

            if (amount > accountBalance){
                transactionSender.status = "failed";

                bankUserData.transactions.push(transactionSender);

                await bankUserData.save()

                return res.status(400).json({error:"Insufficient funds"})

            }else {
                bankUserData.balance.bankAccount.balance -= amount;
                bankReceiverData.balance.bankAccount.balance += amount;

                bankUserData.transactions.push(transactionSender)
                bankReceiverData.transactions.push(transactionReceiver)

                await bankUserData.save()
                await bankReceiverData.save()

                const receiverUser = await User.findOne({bankData:bankReceiverData._id})

                const receiverSocketID =  getReceiverSocketId(receiverUser._id);

                console.log(receiverSocketID,'ID');

                const updatedReceiverUser = await User.findById(receiverUser._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })

                io.to(receiverSocketID).emit('updateUser',updatedReceiverUser)

                const updatedUser = await User.findById(user._id).populate({
                    path: 'bankData',
                    populate: {
                        path: 'transactions.receiver transactions.sender',
                        model: 'User'
                    }
                })


                return res.status(200).json(updatedUser);
            }

        }


    }catch(err) {
        console.log(err)
        throw new Error(err.message);
    }
}
const deleteTransactions = async (req, res) => {
    try {
        const user = req.user;
        const transactionIds = req.body;

        const userDoc = await User.findById(user._id).populate('bankData');
        const bankData = userDoc.bankData;

        bankData.transactions = bankData.transactions.filter(
            (transaction) => !transactionIds.includes(transaction._id.toString())
        );

        await bankData.save();

        const updatedUser = await User.findById(user._id).populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        });

        res.status(200).json(updatedUser);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
};

const getLoan =async (req,res) => {
    try {
        const user = req.user;
        const fullName = user.fname + " " + user.lname;
        const {percentage,deadline,money,loanType} =req.body;
        const bankUserData = await BankData.findById(user.bankData);



        let year = new Date().getFullYear() + Number(deadline);
        let day = new Date().getDate().toString().padStart(2, '0');
        let month = (new Date().getMonth() + 1).toString().padStart(2, '0');
        const r = (percentage / 100) / 12;
        const n = Number(deadline) * 12;



        const monthlyFee = (money * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
        const loan = {
            loanType,
            fullName,
            percentage,
            deadline:`${day}:${month}:${year}`,
            money,
            returnedMoney:0,
            monthlyFee
        }
        bankUserData.loans.push(loan)
        bankUserData.balance.bankAccount.balance += Number(money);
        await bankUserData.save();

        const updatedUser = await User.findById(user._id).populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        });

        res.status(200).json(updatedUser);

    }catch (err){
        console.log(err)
    }
}
const payLoan =async (req,res) => {
    try {
        const user = req.user;
        const loanId = req.query.loanId
        const bankUserData = await BankData.findById(user.bankData);
        const loan = bankUserData.loans.find((loan) => loan.id === loanId)
        if (loan.monthlyFee >  bankUserData.balance.bankAccount.balance){
            return res.status(400).json({error:"Insufficient funds"})

        }else {
            loan.returnedMoney += loan.monthlyFee;

            bankUserData.balance.bankAccount.balance -= loan.monthlyFee;
        }
        await bankUserData.save();

        const updatedUser = await User.findById(user._id).populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        });

        res.status(200).json(updatedUser);
    }catch (e) {
        console.log(e)
    }
}


module.exports = {
    addBalance,
    printFile,
    addCard,
    addToCardBalance,
    addMoneyToCard,
    addToAccount,
    deleteTransactions,
    getLoan,
    payLoan
}