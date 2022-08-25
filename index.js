
let productList = document.getElementById('productlist');

fetch('http://localhost:8080/api/products')
    .then( (response) => response.json() )
    .then( (data) => {
        data.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML= `<p>Producto: ${product.name} Stock: ${product.stock} Precio: ${product.price}</p>`
            productList.appendChild(li)
        });
    })
  