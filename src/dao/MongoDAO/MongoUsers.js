import mongoose from "mongoose";
import MongoDBContainer from "./MongoDBContainer.js";

const collection = 'users';

const usersSchema = mongoose.Schema({
    name:{type:String, required: true},
    email:{type:String, required: true},
    password:{type:String, required: true},
    address:{type:String, required: true},
    age:{type:Number, required: true},
    phoneNumber:{type:String, required: true},
    imageUrl:{type:String},
})

export default class MongoUsers extends MongoDBContainer{
    constructor(){
        super(collection,usersSchema);
    }

    getByMail = async (mail) => {
        let result = await this.model.find({ email: mail });
        return result;
      };

}