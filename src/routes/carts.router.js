import e, { Router } from "express";
import CartManager from "../managers/cart.manager.js";
import ProductsManager from "../managers/product.manager.js";

const router = Router();
let useCartManager = new CartManager();
let useProductsManager = new ProductsManager();

router.get("/", async (req, res) => {
  let allCarts = JSON.stringify(await useCartManager.getAll());
  res.end(allCarts);
});

// Add a cart and return the id
router.post("/", async (req, res) => {
  let newCart = {
    products: [],
  };
  newCart.products = [];
  newCart.timestamp = Date.now();
  let newCartId = await useCartManager.save(newCart);
  res.status(201).send({
    message: "Carrito agregado",
    id: newCartId,
  });
});

///////// to delete cart
router.delete("/:cid", async (req, res) => {
  let cartID = req.params.cid;
  await useCartManager.deleteById(cartID);
  res.status(202).send({
    message: "carito Eliminado",
  });
});

///////////To get products from the cart
router.get("/:cid/products", async (req, res) => {
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.status(400).send('{ "error" : "carrito inexistente"}');
  }
  let allProducts = await useProductsManager.getAll();
  let showList = [];
  // Here I compare the two arrays and create a new one called showList with the matching products.
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
  res.status(200).send({
    products: showList,
  });
});

////////////////// To add products to the cart by their product id
router.post("/:cid/products", async (req, res) => {
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.status(400).send('{ "error" : "non-existent cart"}');
  }
  let newProduct = req.body;
  let existProduct = await useProductsManager.getById(newProduct.product);
  if (existProduct === null) {
    return res.status(400).send('{"error": "non-existent product');
  }
  let productsInCart = cart.products;
  const prodIndex = productsInCart.findIndex(
    (item) => item.product === newProduct.product
  );
  if (prodIndex === -1) {
    // If there are no products, it is added directly
    productsInCart.push(newProduct); //I update the cart with the added product
  } else {
    let newCuantity = productsInCart[prodIndex].quantity + newProduct.quantity;
    newProduct.quantity = newCuantity;
    productsInCart.splice(prodIndex, 1); // I delete the old object and
    productsInCart.push(newProduct); // I push the new updated object
  }
  await useCartManager.deleteById(cartID);
  await useCartManager.save(cart, cartID);
  res.status(201).send({
    cartId: cartID,
    products: cart.products,
  });
});

////////////////To delete products from the cart////////////
router.delete("/:cid/products/:pid", async (req, res) => {
  let productID = req.params.pid;
  let cartID = req.params.cid;
  let cart = await useCartManager.getById(cartID);
  if (cart === null) {
    return res.status(400).send({
      message: "No existe el carrito con ese id",
    });
  }
  //I have to get the array of products from the cart
  let productsInCart = cart.products;
  let prodIndex = await productsInCart.findIndex(
    (item) => item.product === productID
  );
  if (prodIndex === -1) {
    return res.status(400).send({
      message: "Error no existe el producto en carrito",
    });
  }
  productsInCart.splice(prodIndex, 1); // remove the product from the array
  cart.products = productsInCart; // I update the array
  await useCartManager.deleteById(cartID);
  await useCartManager.save(cart, cartID);
  res.status(202).send({
    cartId: cartID,
    message: "deleted product",
  });
});

export default router;
