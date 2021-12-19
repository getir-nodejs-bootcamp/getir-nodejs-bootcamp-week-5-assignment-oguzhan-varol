const Product = require("../models/Products")

const list = () =>{
    return Product.find({})
    .populate({
        path:"user_id",
        select:"first_name email",
    })
    .populate({
        path:"comments",
        populate:{
            path:"user_id",
            select:"first_name",
        }
    })
}


const insert = (data) =>{
    return new Product(data).save()
}


const findOne = (where) =>{
    return Product.findOne(where)
}

const updateDoc = (data,updateData) =>{
    return Product.findByIdAndUpdate(data,updateData,{new:true})
}

const remove = (id) =>{
    return Product.findByIdAndDelete(id);
}


module.exports = {
    list,
    insert,
    findOne,
    updateDoc,
    remove,
}