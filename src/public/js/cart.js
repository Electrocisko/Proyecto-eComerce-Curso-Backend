const userCartId = document.getElementById('userCartId').innerText;

let urlProducts = `/api/carts/${userCartId}/products`;

fetch(urlProducts)
    .then((response) => response.json())
    .then( (data) => {
        data.products.forEach(element => {
            let container = document.createElement('div');
            container.innerHTML = `<p><strong> ${element.product} </strong>  $ ${element.price} Cantidad: ${element.cuantity} Total Pesos: ${element.price * element.cuantity}</p>`
            document.body.append(container)
        }); 
    })





