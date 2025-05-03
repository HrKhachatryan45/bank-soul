const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const BankData = require('../models/bankDataModel');
const getAccountID = require('../middlewares/getAccountID')
const jwt = require('jsonwebtoken');
const validator = require('validator');
const register = async (req, res) => {
    try{
        const {fname,lname,username,password,confirmPassword} = req.body;

        const  user = await User.findOne({username});

        if(user){
            return res.status(400).json({error:"Username already exists"});
        }

        if (password !== confirmPassword){
            return res.status(400).json({error:"Passwords don't match"});
        }
        if (!validator.isStrongPassword(password)){
            return res.status(400).json({error:"Password is not strong"});
        }
        const  hashedPassord =await bcrypt.hash(password, 10);
        const accountID = await getAccountID();
        const newBankData = new BankData({
            balance:{
                bankAccount:{
                    fullName:fname+' '+lname,
                    balance:0,
                    accountID
                },
                cards:[]
            }
        })
        await  newBankData.save()


        const newUser = await  new User({
            fname,
            lname,
            username,
            password:hashedPassord,
            bankData:newBankData._id
        })

        if (newUser){
            const  token = jwt.sign({userId:newUser._id},process.env.JWT_SECRET,{expiresIn: '3d'});
            res.cookie('jwt', token, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
            })
        }
       await newUser.save()


        const  toSendUser = await newUser
            .populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        });

        res.status(200).json(toSendUser);


    }catch(err){
        console.log(err)
        return  res.status(500).json({error:err.message});
    }
}

const login = async (req, res) => {
    try{
        const {username,password} = req.body;

        const  user = await User.findOne({username});

        if(!user){
            return res.status(401).json({error:"Incorrect username "});
        }

        const  match = await bcrypt.compare(password,user.password);

        if(!match){
            return res.status(401).json({error:'Incorrect password'});
        }

        if (user){
            const  token = jwt.sign({userId:user._id},process.env.JWT_SECRET,{expiresIn: '3d'});
            res.cookie('jwt', token, {
                maxAge: 15 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'strict',
                secure: process.env.NODE_ENV !== 'development',
            })
        }
        await user.save()


        const  toSendUser = await user
            .populate({
            path: 'bankData',
            populate: {
                path: 'transactions.receiver transactions.sender',
                model: 'User'
            }
        })

        res.status(200).json(toSendUser);


    }catch(err){
        console.log(err)
        return  res.status(500).json({error:err.message});
    }
}

const logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
        });
        res.status(200).json({ msg: 'User successfully logged out' });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

module.exports = {
    register,
    login,
    logout
};
