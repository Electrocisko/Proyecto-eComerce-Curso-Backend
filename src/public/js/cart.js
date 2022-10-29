const userCartId = document.getElementById('userCartId').innerText;
const sendMail = document.getElementById('sendMail')


let urlProducts = `/api/carts/${userCartId}/products`;

fetch(urlProducts)
    .then((response) => response.json())
    .then( (data) => {
        data.products.forEach(element => {
            let container = document.createElement('div');
            container.innerHTML = `<p><strong> ${element.product} </strong>  $ ${element.price} Cantidad: ${element.cuantity} Total Pesos: ${element.price * element.cuantity}</p>`
            document.body.append(container)
        }); 

        sendMail.addEventListener('click',async() => {
            fetch('/api/messages/mail', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
            'Content-type': 'application/json; charset=UTF-8',
            },
        })
        .then((response) => response.json())
        .then((data) => console.log(data))  
        })

    })



 


