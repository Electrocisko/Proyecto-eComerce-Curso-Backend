import { Router } from "express";
import passport from "passport";
import {upLoader} from '../utils.js';

const router = new Router();

router.post(
  "/register",
  upLoader.single("imageUrl"),
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerfail", passReqToCallback: true
  }),
  async (req, res) => {
      res.send({ status: "succes", payload: req.user });
  }
);

router.get("/registerfail", (req, res) => {
  res.status(400).send({ status: "error", message: 'user registration error' });
});

router.post("/login", passport.authenticate('login',{failureRedirect:'/api/sessions/loginfail'}), async (req, res) => {
  req.session.user = {
    name: req.user.name,
    email: req.user.email,
    id: req.user._id
  }
  res.send({ status: "succes", payload: req.session.user });
});

router.get("/loginfail", (req, res) => {
  res.status(400).send({ status: "error", message: 'user registration error' });
});

router.get('/logout',async(req,res) => {
  req.session.destroy( err => {
      if(!err)  res.redirect('/login');
      else res.send({status: 'Logout Error', body: err})
  });
});

export default router;
