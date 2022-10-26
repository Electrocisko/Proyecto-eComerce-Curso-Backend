const cards = document.getElementById("cards");
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const userid = document.getElementById('idUser').textContent

console.log('userid:',userid)
////////////////////////////////////////////////////////////
//Necesito generar un carrito

let cartId;
let existCard;

const getCartId = (data) =>{
  cartId = data.cart._id;
  existCard = true;
  console.log('cartId:' ,cartId);
  return cartId
}

let createCard = () => {
  fetch('/api/carts', { 
    method: 'POST',
    headers: {
      'Content-type': 'application/json; charset-UTF-8'
    }
  })
  .then( resp => resp.json())
  .then( data =>getCartId(data));
}


//////////////////////////////////////////////////////////////////
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
 
  createCard();
});

cards.addEventListener('click', e => {
    addCarrito(e)
})

const fetchData = async () => {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    pintarCards(data);
  } catch (error) {
    console.log(error)
  }
};

let imgUrl;

const pintarCards = (data) => {
    data.forEach(producto => {
        imgUrl = '/img/'+producto.thumbnail
        templateCard.querySelector('h5').textContent = producto.name;
        templateCard.querySelector('p').textContent = producto.price;
        //templateCard.querySelector('img').setAttribute('src',imgUrl);
        templateCard.querySelector('.btn-dark').dataset._id = producto._id

        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    });
    cards.appendChild(fragment)
}

const addCarrito = e => {
    let clickTarget = e.target.classList.contains('btn-dark');
    if (clickTarget){
        setCarrito(e.target.parentElement)
    }
    e.stopPropagation()
}

const setCarrito = objeto => {
    // const producto = {
    //     _id: objeto.querySelector('.btn-dark').dataset._id,
    //     name: objeto.querySelector('h5').textContent,
    //     price: objeto.querySelector('p').textContent,
    //     cantidad: 1
    // }
   //carrito[0] = producto
  let _id = objeto.querySelector('.btn-dark').dataset._id
  if(!existCard) {
    createCard()
  }
  else {
    //Aca va el post("/:cid/products"
    let url = `/api/carts/${cartId}/products`
    fetch(url, {
      method: 'POST',
      body: JSON.stringify({
        "product": _id
    }
   ),
      headers: {
      'Content-type': 'application/json; charset=UTF-8',
      },
      })
      .then((response) => response.json())
      .then((data) => console.log(data))
  }



  let productsInCart = {
    "products": [
      {
          "product": "Azulejo Vermeer",
          "productId": "630f46ccc684f1697721c781",
          "price": 450,
          "stock": 3,
          "cuantity": 2
      },
      {
          "product": "Jarra para crema",
          "productId": "630f4773c684f1697721c785",
          "price": 450,
          "stock": 3,
          "cuantity": 1
      }
  ]
}

   pintarCarrito(productsInCart);
}


const pintarCarrito = (data) => {
  console.log('pintarcarrito',data);
  let lista = data.products
  console.log(lista)
 
  lista.forEach(element => {
    templateCarrito.getElementById('idnum').textContent = element.productId
    templateCarrito.getElementById('name').textContent = element.product
    templateCarrito.getElementById('cuantity').textContent = element.cuantity
    templateCarrito.getElementById('total-price').textContent = (element.cuantity * element.price)
       const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  });
  items.appendChild(fragment)
}




// const pintarCarrito = (data) => {
//       data.forEach(producto => {
//     templateCarrito.querySelector('th').textContent = producto.product
//     templateCarrito.querySelectorAll('td')[0].textContent = producto.quantity
//     templateCarrito.querySelector('.btn-info').dataset._id = producto._id
//     templateCarrito.querySelector('.btn-danger').dataset._id = producto._id
//     templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price

//     const clone = templateCarrito.cloneNode(true)
//     fragment.appendChild(clone)
//   })
//   items.appendChild(fragment)
// }