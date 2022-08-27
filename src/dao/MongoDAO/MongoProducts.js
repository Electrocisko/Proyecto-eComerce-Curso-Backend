import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'products';
const productsSchema = mongoose.Schema({
    name:String,
    description:String,
    code:String,
    price:Number,
    stock:Number,
    thumbnail:String,
    timestamp:Number
})

export default class MongoProducts extends MongoDBContainer{
    constructor(){
        super(collection,productsSchema);
    }
}