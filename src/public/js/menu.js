const cards = document.getElementById("cards");
const items = document.getElementById('items');
const footer = document.getElementById('footer');
const templateCard = document.getElementById("template-card").content;
const templateFooter = document.getElementById('template-footer').content;
const templateCarrito = document.getElementById('template-carrito').content;
const fragment = document.createDocumentFragment();


////////////////////////////////////////////////////////////
//Necesito generar un carrito













//////////////////////////////////////////////////////////////////
let carrito = [];

document.addEventListener("DOMContentLoaded", () => {
  fetchData();
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
    const producto = {
        _id: objeto.querySelector('.btn-dark').dataset._id,
        name: objeto.querySelector('h5').textContent,
        price: objeto.querySelector('p').textContent,
        cantidad: 1
    }
   carrito[0] = producto
   pintarCarrito();
}

const pintarCarrito = () => {
  Object.values(carrito).forEach(producto => {
    templateCarrito.querySelector('th').textContent = producto.name
    templateCarrito.querySelectorAll('td')[0].textContent = producto.cantidad
    templateCarrito.querySelector('.btn-info').dataset._id = producto._id
    templateCarrito.querySelector('.btn-danger').dataset._id = producto._id
    templateCarrito.querySelector('span').textContent = producto.cantidad * producto.price

    const clone = templateCarrito.cloneNode(true)
    fragment.appendChild(clone)
  })
  items.appendChild(fragment)
}