import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import sessionsRouter from './routes/sessions.router.js';
import {engine} from "express-handlebars";
import MongoStore from "connect-mongo";
import session from 'express-session';
import initializePassport from "./config/passport.config.js";
import passport from "passport";
import dotenvConfig from "./config/dotenv.config.js";
import logger from "./config/winston.config.js";
import services from './dao/index.js';
import cluster from 'cluster';
import os from 'os';

// initializations
const app = express();
const PORT = dotenvConfig.app.PORT || 8080;
const modoCluster = process.argv[2] == 'CLUSTER'
const MONGO_URL = dotenvConfig.mongo.MONGO_URL;
const numCPUs = os.cpus().length;

// settings
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views',__dirname+'/views');

// middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  store:MongoStore.create({
    mongoUrl:MONGO_URL,
    ttl:600
  }),
  secret:'clave',
  resave:false,
  saveUninitialized:false
}))
initializePassport();
app.use(passport.initialize());
app.use(passport.session());
app.use("/", express.static(__dirname + "/public"));

// routes
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use('/api/users', usersRouter );
app.use('/api/sessions', sessionsRouter);
app.use('/',viewsRouter);
app.use(function (req, res, next) {
  res.status(404).send({
    message: "Error route not implemented",
  });
}); 

// Starting the server
if(modoCluster && cluster.isPrimary) {
  logger.log('info', `Master ${process.pid} process is running`)

  for (let i=0; i<numCPUs;i++){
    cluster.fork();
  };

  cluster.on('exit', worker => {
    logger.log('info', `Worker ${worker.process.pid} died ${new Date().toLocaleString()}`);
    cluster.fork();
  })

} else {
  app.listen(PORT, () => {
    logger.log('info', `server listening on http://localhost:${PORT} process: ${process.pid}`);
    logger.log('info',`Persistence: ${services.persistence}`)
  });
}



