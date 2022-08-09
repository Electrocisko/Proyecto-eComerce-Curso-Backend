import express from "express";
import __dirname from "./utils.js";
import productsRouter from "./routes/products.router.js";
import cartsRouter from "./routes/carts.router.js";

const app = express();
const PORT = process.env.PORT || 8080;



app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/", express.static(__dirname + "/public"));
app.use("/api/carts", cartsRouter);



app.use("/api/products", productsRouter);

app.use(function(req,res,next){ // Midelware para devolver error 404 a las rutas que no existen
  res.status(404).send({
    message: 'Error Ruta no implementada'
  });
})

const server = app.listen(PORT, () => {
  console.log(
    `Servidor escuchando en http://localhost:${server.address().port}`
  );
});

server.on("Error", (error) => {
  console.log("Error en el servidor", error);
});
