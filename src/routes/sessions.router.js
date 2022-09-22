import { Router } from "express";
import services from "../dao/index.js";
import {createHash, isValidPassword} from '../utils.js';

const router = new Router();

router.post("/register", async (req, res) => {
    const { name, email, password, address, age, phoneNumber, imageUrl } = req.body;
    if (!name || !email || !password || !address || !age || !phoneNumber || !imageUrl) return res.status(400).send({status:'error',  message: 'Error Incomplete values'});
    const exist = await services.usersService.getByMail(email);
    if (!exist) return res.status(400).send({status:'error', message: 'User already exist'});
    let newUser = {
      name,
      email,
      password: createHash(password),
      address,
      age,
      phoneNumber,
      imageUrl,
    };
    let result = await services.usersService.save(newUser);
    res.send({status:'succes', payload: result});
  });
  
  router.post('/login',async (req,res) => {
    const {email , password} = req.body;
    if (!email || !password) return res.status(400).send({status: 'error', message: 'Error Incomplete values'});
    let user = await services.usersService.getByMail(email);
    if (user.length === 0) return res.status(400).send({status: 'error', message: 'Incorrect Credentials'});
    if(!isValidPassword(user[0],password)) return res.status(401).send({status:'error', message: 'Incorrect password o mail'});
    req.session.user = user;
    res.send({status:'succes', payload: req.session.user})
  });

  export default router;