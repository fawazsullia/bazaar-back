const mongoose = require('mongoose')

const orderSchema = new mongoose.Schema({

    productId : String,
    userUid : String,
    status : String,
    orderDate : String


})

const OrderModel = mongoose.model("OrderModel", orderSchema)

module.exports = OrderModel;