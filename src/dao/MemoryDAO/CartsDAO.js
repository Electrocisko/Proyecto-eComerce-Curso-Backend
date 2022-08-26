import MemoryContainer from "./MemoryContainer.js";

let i =0;
export default class CartsDAO extends MemoryContainer{

    save = (element,id) =>{
        i++;
        id === undefined ? element.id = i : element.id = parseInt(id);
        this.data.push(element);
        return element;
    }

};