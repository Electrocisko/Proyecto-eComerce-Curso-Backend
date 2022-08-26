const persistence = "MEMORY";

let productsService;
let cartsService;

switch(persistence){
    case "MEMORY":
        const {default:MemProduct} = await import('./MemoryDAO/ProductsDAO.js');
        productsService = new MemProduct();
        const {default:MemCarts} = await import('./MemoryDAO/CartsDAO.js');
        cartsService = new MemCarts();
        break;
    case "LOCALFILE":
        const {default:FileProduct} = await import('./FileDAO/FileProducts.js');
        productsService = new FileProduct();
        break;
}

const services = {
    productsService,
    cartsService,
}


export default services;