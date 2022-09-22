import { Router } from "express";
import services from "../dao/index.js";
import {createHash} from '../utils.js';

const router = new Router();

router.post("/register", async (req, res) => {
    const { name, email, password, address, age, phoneNumber, imageUrl } = req.body;
    if (!name || !email || !password || !address || !age || !phoneNumber || !imageUrl) return res.status(400).send({message: 'Error Incomplete values'});
    const exist = await services.usersService.getByMail(email);
    if (!exist) return res.status(400).send({message: 'User already exist'});
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
    res.send(result);
  });
  
  router.post('/login',async (req,res) => {
    let result = await services.usersService.getByMail(req.body.email);
    req.session.user = result;
    res.send(result)
  });

  export default router;