import { Router } from "express";

const router = new Router();

router.get('/register', async (req,res) => {
    res.render('register')
});

router.get('/login', async (req,res) => {
    res.render('login')
});

router.get('/',async (req,res) => {
    res.render('index')
});

router.get('/menu',(req,res) => {
    if (!req.session.user) res.render('login');
    res.render('menu',{user: req.session.user});
})

export default router;
