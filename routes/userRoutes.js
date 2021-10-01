const express = require('express')
const mongoose = require('mongoose')
const UserModel = require('../models/userModel')
 const router = express.Router()

//get current user
router.get('/:id', async (req, res)=> {

    const userUid = req.url.replace("/","").trim()
    console.log(userUid)
    try{
    const data = await UserModel.findOne({uid : userUid})
    await res.status(200).json(data).end()
    }
    catch(err){
        res.status(400).json({ status : false, message : "Could not find user"  }).end()

    }


}) 

//create a new user

router.post('/', async (req, res)=> {

const user = new UserModel({
    displayName : req.body.displayName,
    userType : "user",
    address : req.body.address,
    email : req.body.email,
    uid : req.body.uid,
    cart : [],
    orders : []
});

try{

await user.save();
await res.status(200).json({ status : true, message : "Account created and details saved successfully"}).end()

}
catch(err){
    res.status(400).json({status : false, message : "Account could not be created"}).end()
}

})

//add item to cart
router.put('/cart/add', async (req,res)=>{

const { uid, productId} = req.body;

try{
await UserModel.findOneAndUpdate({ uid : uid  },  {$push : { cart : { $each : [{productId : productId, count : 1}], $position : 0} }})
await res.status(200).json({ status : true, message : "Updated Successfully" }).end()
}
catch(err){
    res.status(400).json({ status : false, message : "Could not update"}).end()
}
})


//change order count
router.put('/cart/count', async (req,res)=> {

const { uid, productId, count  } = req.body
try{
await UserModel.findOneAndUpdate( { uid : uid, "cart.productId" : productId  }, { '$set' : {'cart.$.count' : count }   }     )
await res.status(200).json({status : true, message : "Updated"}).end()
}
catch(err){
res.status(500).json({status : false, message : "Failed to update"}).end()
}


})

//delete cart items
router.put('/cart/del', async (req,res)=> {

const {uid, productId} = req.body;

try{   

await UserModel.findOneAndUpdate({ uid : uid }, { $pull: { cart: { "productId": productId } } } )
await res.status(200).json({status : true, message : "Successfully removed"}).end()

 }
catch(err){
    res.status(500).json({status : false, message : "Failed to remove"}).end()
    console.log(err)

}


})


//delete the user account
router.delete('/:id', async ()=> {

    const uid = req.url.replace("/","").trim();

    try{
        await UserModel.findOneAndDelete({uid : uid});
        await res.status(200).json({status : true, message : "Account Deleted"}).end()
    }
    catch(err){
        res.status(500).json({status : false,  message: "Unable to delet"}).end()
    }



} );

//update address and display name

router.put('/edit', async (req, res)=> {

const { uid, displayName, address   } = req.body;
try{

await UserModel.findOneAndUpdate({ uid : uid }, { displayName : displayName, address : address})
await res.status(200).json({status : true, message : "Updated"}).end()

}
catch(err){
    res.status(500).json({status: false, message : ' Failed to delete'}).end()
}


})


//track user orders

router.put('/orders', async (req, res)=>{

const { uid, date, productId, title, count, total, status, image  } = req.body
const data = {
    productId : productId,
    title : title,
    count : count,
    total : total,
    date : date,
    status : status,
    image : image
}

try{
  
await UserModel.findOneAndUpdate({ uid : uid},  {$push : { orders : { $each : [data], $position : 0} }} )
await UserModel.findOneAndUpdate({ uid : uid }, { $pull: { cart: {}} } )

await res.status(200).json({status : true, message : "Order Updated"}).end()

}
catch(err){
res.status(500).json({status : false, message : "Failed to order"})
}



})


//get orders of a user

router.get('/orders/:id', async (req,res)=> {
    const uid = req.url.replace("/orders/","").trim();

    try{

      const orders =  await UserModel.findOne({uid : uid}, 'orders').exec()
      console.log(orders)
        await res.status(200).json({status : true, orders : orders }).end()


    }
    catch(err){
        res.status(500).json({status : false, message : "Could not retrieve orders"}).end()
    }


})




 module.exports = router



