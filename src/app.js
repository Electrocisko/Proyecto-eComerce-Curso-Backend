import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";
import usersRouter from './routes/users.router.js';
import viewsRouter from './routes/views.router.js';
import handlebars from "express-handlebars";
import MongoStore from "connect-mongo";
import session from 'express-session';

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  store:MongoStore.create({
    mongoUrl:'mongodb+srv://zuchi:xkT3ZDTSXyDv4hB@cluster0.rvl2uyz.mongodb.net/ecommerce?retryWrites=true&w=majority',
    ttl:600
  }),
  secret:'clave',
  resave:false,
  saveUninitialized:false
}))

app.use("/", express.static(__dirname + "/public"));
app.use("/api/carts", cartsRouter);
app.use("/api/products", productsRouter);
app.use('/api/users', usersRouter );


// Template config engine
app.engine('handlebars', handlebars.engine());
app.set('views',__dirname+'/views');
app.set('view engine', 'handlebars');

app.use('/',viewsRouter);

app.use(function (req, res, next) {
  // Midelware to return error 404 to routes that do not exist
  res.status(404).send({
    message: "Error route not implemented",
  });
});






const server = app.listen(PORT, () => {
  console.log(`server listening on http://localhost:${server.address().port}`);
});

server.on("Error", (error) => {
  console.log("server error", error);
});
