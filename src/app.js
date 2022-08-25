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
