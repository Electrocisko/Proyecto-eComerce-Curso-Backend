const cards = document.getElementById("cards");
const items = document.getElementById("items");
const templateCard = document.getElementById("template-card").content;
const fragment = document.createDocumentFragment();
const userid = document.getElementById("idUser").textContent;
const cartId = document.getElementById("idCart").textContent;
const pedido = document.getElementById("toCart");
const contador = document.getElementById('cont')

let cont = 0;
contador.innerHTML=`<h5>Productos en carrito: ${cont}</h5>`

document.addEventListener("DOMContentLoaded", () => {
  fetchData(); // llama los productos de la base de datos
});

cards.addEventListener("click", (e) => {
  addCarrito(e);
});

const fetchData = async () => {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    renderCards(data);
  } catch (error) {
    console.log(error);
  }
};

const renderCards = (data) => {
  data.forEach((product) => {
    imgUrl = "/img/" + product.thumbnail;
    templateCard.querySelector("h5").textContent = product.name;
    templateCard.querySelector("p").textContent = product.price;
    templateCard.querySelector('img').setAttribute('src',imgUrl);
    templateCard.querySelector(".btn-dark").dataset._id = product._id;
    const clone = templateCard.cloneNode(true);
    fragment.appendChild(clone);
  });
  cards.appendChild(fragment);
};

const addCarrito = (e) => {
  let clickTarget = e.target.classList.contains("btn-dark");
  if (clickTarget) {
    setCart(e.target.parentElement);
  }
  e.stopPropagation();
};

const setCart = (objeto) => {
  let _id = objeto.querySelector(".btn-dark").dataset._id;

  //here the product is added to the cart
  let url = `/api/carts/${cartId}/products`;

  fetch(url, {
    method: "POST",
    body: JSON.stringify({
      product: _id,
    }),
    headers: {
      "Content-type": "application/json; charset=UTF-8",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let urlProducts = `/api/carts/${data.cartId}/products`;
      fetch(urlProducts)
        .then((response) => response.json())
        .then((aux) => {
          Swal.fire({
            position: 'top',
            icon: 'success',
            title: 'Agregado',
            showConfirmButton: false,
            timer: 500
            })
            cont = cont +1;
            contador.innerHTML=`<h5>Productos en carrito: ${cont}</h5>`
          persistProducts(aux);
        });
    });
};

const persistProducts = (data) => {
  showProducts = data;
};

pedido.addEventListener("click", () => {
  location.href = "/cart";
});
