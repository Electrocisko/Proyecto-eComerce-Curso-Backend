import { Router } from "express";
import passport from "passport";

const router = new Router();

router.post(
  "/register",
  passport.authenticate("register", {
    failureRedirect: "/api/sessions/registerfail",
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
    email: req.user.email,
    id: req.user._id
  }
  res.send({ status: "succes", payload: req.session.user });
});

router.get("/loginfail", (req, res) => {
  res.status(400).send({ status: "error", message: 'user registration error' });
});

export default router;
