const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cardSchema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    color:{
      type: String,
      required: true
    },
    balance:{
        type:Number,
        required:true,
        default:0
    },
        cvv:{
            type: Number,
            required: true,
        },
        digits16:{
            type: String,
            required: true,
        },
        expDate:{
            type: String,
            required: true
        },
        phoneNumber:{
            type: String,
            required: true
        },
        title:{
            type: String,
            required: true
        }
})
const  loanSchema = new Schema({
    loanType:{
      type: String,
      required: true,
    },
    fullName:{
        type: String,
        required: true,
    },
    percentage:{
        type: Number,
        required: true
    },
    monthlyFee:{
        type: Number,
        required: true,
    },
    deadline:{
        type: String,
        required: true
    },
    money:{
        type: Number,
        required: true
    },
    returnedMoney:{
        type: Number,
        required: true
    }
})
const accountSchema = new Schema({
    fullName:{
        type: String,
        required: true,
    },
    balance:{
        type: Number,
        required: true,
        default:0
    },
    accountID:{
        type: String,
        required: true,
        unique: true
    }
})
const  tranSchema = new Schema({
    date:{
        type:String,
        required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
    receiver:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    sender:{
        type:mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    status:{
        type:String,
        required:true,
        enum: ['completed', 'failed'],
    },
    isAdded:{
        type:Boolean,
        required:true,
    }
})

const bankDataSchema = new Schema({
    balance:{
        bankAccount:accountSchema,
        cards: {
            type: [cardSchema],
            default: []
        }
    },
    loans:{
        type:[loanSchema],
        default:[]
    },
    transactions:{
        type:[tranSchema],
        default:[]
    }

})

module.exports = mongoose.model('bankData',bankDataSchema);