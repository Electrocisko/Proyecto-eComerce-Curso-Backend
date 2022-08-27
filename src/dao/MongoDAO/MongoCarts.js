import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'carts';
const cartsSchema = mongoose.Schema({
    products:Array,
    timestamp:Number
})

export default class MongoCarts extends MongoDBContainer{
    constructor(){
        super(collection,cartsSchema);
    }
}