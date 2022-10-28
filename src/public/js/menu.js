const cards = document.getElementById("cards");
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();
const userid = document.getElementById('idUser').textContent;
const pedido = document.getElementById('enviar-pedido');


let cartId;
let existCard;
let showProducts;

const getCartId = (data) =>{
  cartId = data.cart._id;
  existCard = true;
  console.log('cartId:' ,cartId);
  return cartId
}

let createCart = () => {
  let data = {userId: userid}
  fetch('/api/carts', { 
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json;charset=utf-8'
    },
  })
  .then( resp => resp.json())
  .then( data =>getCartId(data));
}

document.addEventListener("DOMContentLoaded", () => {
  fetchData(); // llama los productos de la base de datos
  createCart(); // cuando se carga la pagina crea un carrito por defecto
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

  let _id = objeto.querySelector('.btn-dark').dataset._id
  if(!existCard) {
    createCart()
  }
  else {
    //Aca agrego el producto al carrito
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
      .then((data) => {
          let urlProducts = `/api/carts/${data.cartId}/products`
          fetch(urlProducts)
            .then((response) => response.json())
            .then( (aux) => {
              persistProducts(aux)
            })
        
      })
  }
}

const persistProducts = (data) => {
  showProducts = data;
}

const pintarCarrito = (data) => {
  data.products.forEach(element => {
        templateCarrito.getElementById('idnum').textContent = element.productId
        templateCarrito.getElementById('name').textContent = element.product
        templateCarrito.getElementById('cuantity').textContent = element.cuantity
        templateCarrito.getElementById('total-price').textContent = (element.cuantity * element.price)
        const clone = templateCarrito.cloneNode(true)
       fragment.appendChild(clone)
      });
       //items.appendChild(fragment)
}

pedido.addEventListener('click', () => {
console.log('Click en pedido')
console.log(showProducts) // Aca Se dispara el pedido falta toda la logica
location.href='/cart',{cart: showProducts}
})
