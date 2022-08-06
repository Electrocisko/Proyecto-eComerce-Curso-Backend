import { Router } from "express";
import { nanoid } from "nanoid";
import CartManager from "../managers/cart.manager.js";

const router = Router();
let useCartManager = new CartManager();
let admin = true; // validate the user

router.get("/carts", async (req, res) => {
  let allCarts = JSON.stringify(await useCartManager.getAll());
  res.end(allCarts);
});

router.post("/carts", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let newCart = req.body;
 if (newCart.carts ===undefined) {newCart.carts = []} //Si se declara sin cartos se agrega un array vacio
  newCart.timestamp = Date.now();
  let newCartId = await useCartManager.save(newCart);
  res.send({
    message: "Carrito agregado",
    id: newCartId
  })
});

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

router.get('/carts/:cid/products', async (req,res) =>{
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {return res.end('{ "error" : "producto inexistente"}');}
  
  //Falta que devuelva detalle del objeto
  res.send({
    products: cart.products,
    message: "Falta detalle de productos"
  });
})

// Para incorporar productos al carrito por su id del producto
router.post('/carts/:cid/products', async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {return res.end('{ "error" : "producto inexistente"}');}
  let list = cart.products;
  let newProduct = req.body;
  list.push(newProduct);
  console.log(list)
    res.send({
    cartId: cartID,
    products: list
  })
});




export default router;