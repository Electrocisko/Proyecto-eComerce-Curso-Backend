import { Router } from 'express';
import nodemailer from 'nodemailer';
import dotenvConfig from '../config/dotenv.config.js';
import logger from "../config/winston.config.js";


const router = Router();
let email = dotenvConfig.nodemail.NM_EMAIL;
let code = dotenvConfig.nodemail.NM_CODE;


const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: email,
        pass: code
    }
});

router.post('/mail',async (req,res) => {    
    try {
        let data = JSON.stringify(req.body);
        await transporter.sendMail({
            from: 'Francisco ZK',
            to: 'franciscojuanzk@gmail.com',
            subject: 'Pedido',
            html: data
            });
           res.send({
            message: 'Mail succes'
           })
            
    } catch (error) {
        logger.log('error',`Error en message ${error}`)
    }
});


export  default router;