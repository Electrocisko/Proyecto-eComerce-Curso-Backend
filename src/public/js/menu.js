console.log('Hola menu');

let productList = document.getElementById('productlist');

fetch('/api/products')
    .then( (response) => response.json() )
    .then( (data) => {
        data.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML= `<p>Producto: ${product.name} Stock: ${product.stock} Precio: ${product.price}</p>`
            productList.appendChild(li)
        });
    })
  