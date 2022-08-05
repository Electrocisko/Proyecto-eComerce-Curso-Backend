import express from 'express';
import __dirname from './utils.js';
// import viewsRouter from "./routes/views.router.js";
import productsRouter from "./routes/products.router.js";


const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));
app.use("/api", productsRouter);



const server = app.listen(PORT, () => {
    console.log(
      `Servidor escuchando en http://localhost:${server.address().port}`
    );
  });
  
  server.on("Error", (error) => {
    console.log("Error en el servidor", error);
  });