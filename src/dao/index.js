const persistence = "MONGODB";

let productsService;
let cartsService;

switch (persistence) {
  case "MEMORY":
    const { default: MemProduct } = await import("./MemoryDAO/ProductsDAO.js");
    productsService = new MemProduct();
    const { default: MemCarts } = await import("./MemoryDAO/CartsDAO.js");
    cartsService = new MemCarts();
    break;
  case "LOCALFILE":
    const { default: FileProduct } = await import("./FileDAO/FileProducts.js");
    productsService = new FileProduct();
    const { default: FileCarts } = await import("./FileDAO/FileCarts.js");
    cartsService = new FileCarts();
    break;
  case "MONGODB":
    const { default: MongoProduct } = await import("./MongoDAO/MongoProducts.js");
    productsService = new MongoProduct();
    const { default: MongoCarts } = await import("./MongoDAO/MongoCarts.js");
    cartsService = new MongoCarts();
    break;
}

const services = {
  productsService,
  cartsService,
};

export default services;
