const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/authRoute');
const bankRoutes = require('./routes/bankRoute');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const {app,server} = require('./socket/socket')
require('dotenv').config();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
const port = process.env.PORT || 8080;

app.use('/auth',authRoutes);
app.use('/bank',bankRoutes);



mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        server.listen(port,() => {
            console.log(`Running on port ${port}`);
        })
        console.log('mongodb connected!')
    })
    .catch((err) => {
        console.log(err);
    })

