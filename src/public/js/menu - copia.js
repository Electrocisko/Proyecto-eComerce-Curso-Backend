
let productList = document.getElementById('productlist');

const mostrar = (aux) => console.log(aux)

fetch('/api/products')
    .then( (response) => response.json() )
    .then( (data) => {
        data.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML= `<p>Producto: ${product.name} Stock: ${product.stock} Precio: ${product.price}  <img src="/img/${product.thumbnail}" width="100"> <button onclick=" mostrar(${product.name})">Click me</button></p>`

            productList.appendChild(li)
        });
    })
  

    