const persistence = "MEMORY";

let productsService;

switch(persistence){
    case "MEMORY":
        const {default:MemProduct} = await import('./MemoryDAO/ProductsDAO.js');
        productsService = new MemProduct();
        break;
    case "LOCALFILE":
        const {default:FileProduct} = await import('./FileDAO/FileProducts.js');
        productsService = new FileProduct();
        break;
}

export default productsService;