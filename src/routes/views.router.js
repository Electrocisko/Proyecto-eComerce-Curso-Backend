import { Router } from "express";
import logger from "../config/winston.config.js";

const router = new Router();

router.get('/register', async (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('register')
});

router.get('/login', async (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('login')
});

router.get('/',async (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('index')
});

router.get('/menu',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    if (!req.session.user) res.render('login');
    else {
        res.render('menu',{user: req.session.user});
    }
});

router.get('/errorlogin',(req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('errorLogin')
});

router.get('/errorregister', (req,res) => {
    logger.log('info',`request type ${req.method} en route ${req.path} ${new Date()}`)
    res.render('errorRegister');
});

export default router;

