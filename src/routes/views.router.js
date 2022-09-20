import { Router } from "express";
import services from "../dao/index.js";

const router = new Router();

router.get('/register', async (req,res) => {
    res.render('register')
});

router.get('/login', async (req,res) => {
    res.render('login')
});

export default router;

