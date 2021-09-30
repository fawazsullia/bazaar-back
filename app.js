const express = require('express')
const app = express();
const cors = require('cors')
const PORT = process.env.PORT || 5000;
const mongoose = require('mongoose')
require("dotenv").config();
const uri = "mongodb+srv://fawazsullia:kenkaneki13@cluster0.s30gm.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

app.use(cors());

const UserModel = require('./models/userModel')
const OrderModel = require('./models/orderModel')

app.use(express.json({}))


//routes
const userRoutes = require('./routes/userRoutes')
const orderRoutes = require('./routes/orderRoutes')

//middlewares
app.use('/user', userRoutes)
app.use('/orders', orderRoutes)







mongoose.connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true }, ()=> {console.log("Connected to database")})


app.listen(PORT, ()=>console.log("Server is running"))