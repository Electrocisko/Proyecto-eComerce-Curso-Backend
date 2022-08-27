import  { Router } from "express";
import services from "../dao/index.js";

const router = Router();
let nameFile = '/files/carts.txt'

router.get("/", async (req, res) => {
  let allCarts = JSON.stringify(await services.cartsService.getAll(nameFile));
  res.end(allCarts);
});

// Add a cart and return the id
router.post("/", async (req, res) => {
  let newCart = {
    products: [],
  };
  newCart.timestamp = Date.now();
  let cart = await services.cartsService.save(newCart);
  res.status(201).send({
    message: "Carrito agregado",
    Cart: cart,
  });
});

///////// to delete cart
router.delete("/:cid", async (req, res) => {
  let cartID = parseInt(req.params.cid);
  let cartDelete =  await services.cartsService.deleteById(cartID);
  res.status(202).send({
    'Product Removed': cartDelete,
  });
});

///////////To get products from the cart
router.get("/:cid/products", async (req, res) => {
  let cartID = parseInt(req.params.cid);
  let cart = await services.cartsService.getById(cartID);
  if (cart === null) {
    return res.status(400).send('{ "error" : "carrito inexistente"}');
  }
  let allProducts = await services.productsService.getAll();
  let showList = [];
  // Here I compare the two arrays and create a new one called showList with the matching products.
  allProducts.map((item) => {
    cart.products.forEach((element) => {
      if (element.product === item.id) {
        showList.push({
          product: item.name,
          productId: item.id,
          price: item.price,
          stock: item.stock,
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
  let cartID = parseInt(req.params.cid);
  let cart = await services.cartsService.getById(cartID);
  if (cart === null) {
    return res.status(400).send('{ "error" : "non-existent cart"}');
  }
  let newProduct = req.body;
  if (newProduct.quantity === undefined) {newProduct.quantity = 1} //if the amount is not sent by body, it is taken as one
  let existProduct = await services.productsService.getById(newProduct.product);
  if (existProduct === null) {
    return res.status(400).send('{"error": "non-existent product');
  }
  let productsInCart = cart.products; // the array from products in cart
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
  await services.cartsService.deleteById(cartID);
  await services.cartsService.save(cart, cartID);
  res.status(201).send({
    cartId: cartID,
    products: cart.products,
  });
});

////////////////To delete products from the cart////////////
router.delete("/:cid/products/:pid", async (req, res) => {
  let productID = parseInt(req.params.pid);
  let cartID = parseInt(req.params.cid);
  let cart = await services.cartsService.getById(cartID);
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
  await services.cartsService.deleteById(cartID);
  await services.cartsService.save(cart, cartID);
  res.status(202).send({
    cartId: cartID,
    message: "deleted product",
  });
});

export default router;
