import passport from "passport";
import local from "passport-local";
import services from "../dao/index.js";
import { createHash, isValidPassword } from "../utils.js";
import logger from "./winston.config.js";

const LocalStrategy = local.Strategy;

const initializePassport = () => {
  passport.use(
    "register",
    new LocalStrategy(
      { passReqToCallback: true, usernameField: "email" },
      async (req, email, password, done) => {
        const { name, address, age, phoneNumber, imageUrl } = req.body;
        const exist = await services.usersService.getByMail(email);
        if (exist!==null) return done(null, false);
        let newUser = {
          name,
          email,
          password: createHash(password),
          address,
          age,
          phoneNumber,
          imageUrl: req.file.filename,
        };
        let result = await services.usersService.save(newUser);
        return done(null, result);
      }
    )
  );

  passport.use(
    "login",
    new LocalStrategy(
      { usernameField: "email" },
      async (email, password, done) => {
        if (!email || !password) return done(null, false);
        let user = await services.usersService.getByMail(email);
        if (!user) return done(null, false);
        if (!isValidPassword(user, password)) return done(null, false);
        return done(null, user);
      }
    )
  );

  passport.serializeUser((user, done) => {
    logger.log("debug", `passport.serializeUser: ${user}`);
    done(null, user._id);
  });

  passport.deserializeUser(async (id, done) => {
    let result = await services.usersService.getById(id);
    return done(null, result);
  });
};

export default initializePassport;
