import { Router } from "express";
import services from "../dao/index.js";

let typeOfPersistence = services.persistence;

const router = Router();
let nameFile = "/files/carts.txt";
let pathProducts = "/files/products.txt";

router.get("/", async (req, res) => {
  try {
    let allCarts = JSON.stringify(await services.cartsService.getAll(nameFile));
    res.end(allCarts);
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

// Add a cart and return the id
router.post("/", async (req, res) => {
  try {
    let newCart = {
      products: [],
    };
    newCart.timestamp = Date.now();
    let cart = await services.cartsService.save(newCart, nameFile);
    res.status(201).send({
      message: "Carrito agregado",
      Cart: cart,
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

///////// to delete cart
router.delete("/:cid", async (req, res) => {
  try {
    let cartID = req.params.cid;
    let cartDelete = await services.cartsService.deleteById(cartID, nameFile);
    res.status(202).send({
      "Product Removed": cartDelete,
    });
  } catch (error) {
    res.send({
      message: error,
    });
  }
});

///////////To get products from the cart

router.get("/:cid/products", async (req, res) => {
try {
  let showList = [];
  let allProducts;
  let cartID = req.params.cid;
  let cart = await services.cartsService.getById(cartID, nameFile);
  if (cart === null) {
    return res.status(400).send('{ "error" : "non-existent cart"}');
  }
  if (typeOfPersistence === "mongodb") {
    allProducts = await services.productsService.getAll();
    let productsInCart = cart[0].products;
    allProducts.map((item) => {
      productsInCart.forEach((element) => {
        if (element.product === item._id.toString()) {
          showList.push({
            product: item.name,
            price: item.price,
            stock: item.stock,
            cuantity: element.quantity,
          });
        }
      });
    });
  } else {
    allProducts = await services.productsService.getAll("/files/products.txt");
    //Here I compare the two arrays and create a new one called showList with the matching products.
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
  }
  res.status(200).send({
    products: showList,
  });
} catch (error) {
  res.send({
    Error: error,
  });
}
});

// ////////////////// To add products to the cart by their product id
router.post("/:cid/products", async (req, res) => {
try {
  let productsInCart;
  let newData;
  let cartID = req.params.cid;
  let addProduct = req.body;
  let cart = await services.cartsService.getById(cartID, nameFile);
  if (cart === null) {
    return res.status(400).send('{ "error" : "non-existent cart"}');
  }
  let existProduct = await services.productsService.getById(
    addProduct.product,
    pathProducts
  );
  if (existProduct === null) {
    return res.status(400).send('{"error": "non-existent product');
  }
  if (addProduct.quantity === undefined) {
    addProduct.quantity = 1;
  } //if the amount is not sent by body, it is taken as one
  ///MONGO////
  if (typeOfPersistence === "mongodb") {
    productsInCart = cart[0].products;
    ///////MEMORY Y LOCAL////
  } else {
    productsInCart = cart.products;
    await services.cartsService.deleteById(cartID, nameFile);
    await services.cartsService.save(cart, nameFile, cartID);
  }
  const prodIndex = productsInCart.findIndex(
    (item) => item.product === addProduct.product
  );
  if (prodIndex === -1) {
    // If there are no products, it is added directly
    productsInCart.push(addProduct); //I update the cart with the added product
  } else {
    let newCuantity = productsInCart[prodIndex].quantity + addProduct.quantity;
    addProduct.quantity = newCuantity;
    productsInCart.splice(prodIndex, 1); // I delete the old object and
    productsInCart.push(addProduct); // I push the new updated object
  }
  if (typeOfPersistence === "mongodb") {
    newData = {
      products: productsInCart,
    };
    let updateCart = await services.cartsService.update(
      cartID,
      nameFile,
      newData
    );
  } else {
    newData = productsInCart
    await services.cartsService.deleteById(cartID, nameFile);
    await services.cartsService.save(cart, nameFile, cartID);
  }
  res.status(201).send({
    cartId: cartID,
    products: newData,
  });
} catch (error) {
  res.send({
    Error: error,
  });
}
});

////////////////To delete products from the cart////////////

router.delete("/:cid/products/:pid", async (req, res) => {

  ////MONGODB/////////
  if (typeOfPersistence === "mongodb") {
    let productID = req.params.pid;
    let cartID = req.params.cid;
    let cart = await services.cartsService.getById(cartID);
    if (cart === null) {
      return res.status(400).send({
        message: "No existe el carrito con ese id",
      });
    }
    let productsInCart = cart[0].products; // the array from products in cart
    let prodIndex = productsInCart.findIndex(
      (item) => item.product === productID
    );
    if (prodIndex === -1) {
      return res.status(400).send({
        message: "Error no existe el producto en carrito",
      });
    }
    productsInCart.splice(prodIndex, 1); // remove the product from the array
    let newData = {
      products: productsInCart,
    };
    let updateCart = await services.cartsService.update(
      cartID,
      nameFile,
      newData
    );
    return res.send({
      message: updateCart,
    });

   ////////RESTO//////// 
  } else {
    let productID = req.params.pid;
    let cartID = req.params.cid;
    let cart = await services.cartsService.getById(cartID, nameFile);
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
    await services.cartsService.deleteById(cartID, nameFile);
    await services.cartsService.save(cart, nameFile, cartID);
    res.status(202).send({
      cartId: cartID,
      message: "deleted product",
    });
  }
});

export default router;


////////////////To delete products from the cart////////////

// router.delete("/:cid/products/:pid", async (req, res) => {

//   ////MONGODB/////////
//   if (typeOfPersistence === "mongodb") {
//     let productID = req.params.pid;
//     let cartID = req.params.cid;
//     let cart = await services.cartsService.getById(cartID);
//     if (cart === null) {
//       return res.status(400).send({
//         message: "No existe el carrito con ese id",
//       });
//     }
//     let productsInCart = cart[0].products; // the array from products in cart
//     let prodIndex = productsInCart.findIndex(
//       (item) => item.product === productID
//     );
//     if (prodIndex === -1) {
//       return res.status(400).send({
//         message: "Error no existe el producto en carrito",
//       });
//     }
//     productsInCart.splice(prodIndex, 1); // remove the product from the array
//     let newData = {
//       products: productsInCart,
//     };
//     let updateCart = await services.cartsService.update(
//       cartID,
//       nameFile,
//       newData
//     );
//     return res.send({
//       message: updateCart,
//     });

//    ////////RESTO//////// 
//   } else {
//     let productID = req.params.pid;
//     let cartID = req.params.cid;
//     let cart = await services.cartsService.getById(cartID, nameFile);
//     if (cart === null) {
//       return res.status(400).send({
//         message: "No existe el carrito con ese id",
//       });
//     }
//     //I have to get the array of products from the cart
//     let productsInCart = cart.products;
//     let prodIndex = await productsInCart.findIndex(
//       (item) => item.product === productID
//     );
//     if (prodIndex === -1) {
//       return res.status(400).send({
//         message: "Error no existe el producto en carrito",
//       });
//     }
//     productsInCart.splice(prodIndex, 1); // remove the product from the array
//     cart.products = productsInCart; // I update the array
//     await services.cartsService.deleteById(cartID, nameFile);
//     await services.cartsService.save(cart, nameFile, cartID);
//     res.status(202).send({
//       cartId: cartID,
//       message: "deleted product",
//     });
//   }
// });