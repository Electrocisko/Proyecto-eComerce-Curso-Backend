let id = 0;
export default class MemoryContainer {
  constructor() {
    this.data = [];
  }

  getAll = () => {
    return this.data;
  };

  save = (element) => {
    this.data.push(element);
    return element;
  };

  getById = (id) => {
    const item = this.getAll().find((element) => element.id === parseInt(id));
    if (item !== undefined) {
      return item;
    } else {
      return null;
    }
  };

  deleteById = async (id) => {
    let dataToDelete = this.getById(id);
    let deleted= true;
    if (dataToDelete === null) {
      return deleted = false
    } else {
        this.data = this.getAll();
        let index = this.data.findIndex((item) => item.id === parseInt(id));
        this.data.splice(index, 1);
        return deleted;
    }
  };



  
}
