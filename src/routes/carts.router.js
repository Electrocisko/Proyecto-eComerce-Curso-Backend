import { Router } from "express";
import CartManager from "../managers/cart.manager.js";
import ProductsManager from "../managers/product.manager.js";

const router = Router();
let useCartManager = new CartManager();
let useProductsManager = new ProductsManager();
let admin = true; // validate the user

router.get("/carts", async (req, res) => {
  let allCarts = JSON.stringify(await useCartManager.getAll());
  res.end(allCarts);
});


// Agrega un carrito y devuelve el id
router.post("/carts", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let newCart = req.body;
  if (newCart.carts === undefined) {
    newCart.carts = [];
  } //Si se declara sin carts se agrega un array vacio
  newCart.timestamp = Date.now();
  let newCartId = await useCartManager.save(newCart);
  res.send({
    message: "Carrito agregado",
    id: newCartId,
  });
});


///////// para borrar carrito
router.delete("/carts/:cid", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  await useCartManager.deleteById(cartID);
  res.send({
    message: "carito Eliminado",
  });
});
///////////PAra obtener productos del carrito
router.get("/carts/:cid/products", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.end('{ "error" : "producto inexistente"}');
  }
  //Falta que devuelva detalle del objeto
  res.send({
    products: cart.products,
  });
});

////////////////// Para incorporar productos al carrito por su id del producto
router.post("/carts/:cid/products", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.end('{ "error" : "producto inexistente"}');
  }
  let newProduct = req.body;
  let existProduct = await useProductsManager.getById(newProduct.product);
  console.log('exist?',existProduct)
  cart.products.push(newProduct); //Actualizo el cart con el producto agregado
  await useCartManager.deleteById(cartID);
  await useCartManager.save(cart, cartID);
  res.send({
    cartId: cartID,
    products: cart.products,
  });
});

////////////////Para borrar productos del carrito////////////
router.delete("/carts/:cid/products/:pid", async (req, res) => {
  let productID = req.params.pid;
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.send({
      message: "No existe el carrito con ese id",
    });
  }
  // Tengo que obtener el array de productos del carro
  let productsInCart = cart.products;
  let indice = await productsInCart.findIndex(
    (item) => item.product === productID
  );
  if (indice === -1) {
    return res.send({
      message: "Error no existe el producto en carrito",
    });
  }
  productsInCart.splice(indice, 1); // Elemino el producto del array
  cart.products = productsInCart; // Actualizo el array
  await useCartManager.deleteById(cartID);
  await useCartManager.save(cart, cartID);
  res.send({
    cartId: cartID,
    message: "Producto borrado"
  });
});

////////////////////////////////////////////////////////////////
export default router;
