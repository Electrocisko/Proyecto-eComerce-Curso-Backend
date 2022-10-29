import { Router } from 'express';
import nodemailer from 'nodemailer';
import logger from "../config/winston.config.js";

const router = Router();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: 'electrocisko@gmail.com',
        pass: 'jahlizzjzcjqlnzh'
    }
});

router.post('/mail',async (req,res) => {    
    try {
        console.log('req body en message router',req.body)
        let data = JSON.stringify(req.body)
        let result = await transporter.sendMail({
            from: 'Francisco ZK',
            to: 'franciscojuanzk@gmail.com',
            subject: 'Primer Mail',
            html: data
            });
            logger.log('info',result)
            res.send({
            message: 'Mail enviado'
            });
    } catch (error) {
        logger('error',`Error en message ${error}`)
    }
});

export  default router;