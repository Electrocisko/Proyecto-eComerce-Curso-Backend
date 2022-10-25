
let productList = document.getElementById('productlist');

fetch('/api/products')
    .then( (response) => response.json() )
    .then( (data) => {
        data.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML= `<p>Producto: ${product.name} Stock: ${product.stock} Precio: ${product.price}  <img src="/img/${product.thumbnail}" width="100"> <button type="button" class="btn btn-primary">Agregar </button></p>`
            productList.appendChild(li)
        });
    })
  
