import e, { Router } from "express";
import CartManager from "../managers/cart.manager.js";
import ProductsManager from "../managers/product.manager.js";

const router = Router();
let useCartManager = new CartManager();
let useProductsManager = new ProductsManager();
let admin = true; // validate the user

router.get("/", async (req, res) => {
  let allCarts = JSON.stringify(await useCartManager.getAll());
  res.end(allCarts);
});

// Agrega un carrito y devuelve el id
router.post("/", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let newCart = req.body;
  if (newCart.products === undefined) {
    newCart.products = [];
  } //Si desde el body no se envia ningun array de productos, se agrega un array vacio
  newCart.timestamp = Date.now();
  let newCartId = await useCartManager.save(newCart);
  res.send({
    message: "Carrito agregado",
    id: newCartId,
  });
});

///////// para borrar carrito
router.delete("/:cid", async (req, res) => {
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

///////////Para obtener productos del carrito
router.get("/:cid/products", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.end('{ "error" : "carrito inexistente"}');
  }
  let allProducts = await useProductsManager.getAll();
  let showList = [];
  // Aca comparo los dos arrays y creo otro nuevo  llamado showList con los productos coincidentes, con dos atributos, el nombre y la cantidad
  allProducts.map((item) => {
    cart.products.forEach((element) => {
      if (element.product === item.id) { 
        showList.push({
          product: item.name,
          cuantity: element.quantity,
        });
      }
    });
  });
  res.send({
    products: showList,
  });
});

////////////////// Para incorporar productos al carrito por su id del producto
router.post("/:cid/products", async (req, res) => {
  if (admin !== true) {
    return res
      .status(403)
      .send("No tiene los permisos necesario para esta operacion");
  }
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.end('{ "error" : "Carrito inexistente"}');
  }
  let newProduct = req.body;
  console.log("newproduct", newProduct); //Cheque interno de desarollo
  let existProduct = await useProductsManager.getById(newProduct.product);
  //console.log(newProduct.product);
  if (existProduct === null) {
    return res.status(400).send('{"error": "Producto inexsistente');
  }
  let productsInCart = cart.products;
  const prodIndex = productsInCart.findIndex(
    (item) => item.product === newProduct.product
  );
  if (prodIndex === -1) {
    // Si no hay productos se agrega directo
    productsInCart.push(newProduct); //Actualizo el cart con el producto agregado
  } else {
    let newCuantity = productsInCart[prodIndex].quantity + newProduct.quantity;
    newProduct.quantity = newCuantity;
    productsInCart.splice(prodIndex, 1); // Elimino el viejo objeto y
    productsInCart.push(newProduct); // pusheo el nuevo objeto actualizado
  }
  await useCartManager.deleteById(cartID);
  await useCartManager.save(cart, cartID);
  res.send({
    cartId: cartID,
    products: cart.products,
  });
});

////////////////Para borrar productos del carrito////////////
router.delete("/:cid/products/:pid", async (req, res) => {
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
  let prodIndex = await productsInCart.findIndex(
    (item) => item.product === productID
  );
  if (prodIndex === -1) {
    return res.send({
      message: "Error no existe el producto en carrito",
    });
  }
  // Aca va la logica de borrar o vaciar.
  productsInCart.splice(prodIndex, 1); // Elemino el producto del array
  cart.products = productsInCart; // Actualizo el array
  await useCartManager.deleteById(cartID);
  await useCartManager.save(cart, cartID);
  res.send({
    cartId: cartID,
    message: "Producto borrado",
  });
});

////////////////////////////////////////////////////////////////
export default router;
