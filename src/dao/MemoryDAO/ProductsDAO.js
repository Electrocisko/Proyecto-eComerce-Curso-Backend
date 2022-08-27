import MemoryContainer from "./MemoryContainer.js";

let i = 0;
export default class ProductsDAO extends MemoryContainer{

    save = (element,path,id) =>{
        i++;
        id === undefined ? element.id = i : element.id = parseInt(id);
        this.data.push(element);
        return element;
    }
};



