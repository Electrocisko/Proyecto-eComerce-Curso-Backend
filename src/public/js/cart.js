

const userCartId = document.getElementById("userCartId").innerText;
const userName = document.getElementById("userName").innerText;
const userMail = document.getElementById("userEmail").innerText;
const userId = document.getElementById("userId").innerText;
const sendMail = document.getElementById("sendMail");

let texto = `Pedido de ${userName} con email : ${userMail} ID del usuario: ${userId}  ID del carrito: ${userCartId} \n`;
let urlProducts = `/api/carts/${userCartId}/products`;

const inicio = () => {
  window.location.assign("/");
};

fetch(urlProducts)
  .then((response) => response.json())
  .then((data) => {
    data.products.forEach((element) => {
      let container = document.createElement("div");
      container.className = "container";
      container.innerHTML = `<p><strong> ${
        element.product
      } </strong>  Cantidad: ${element.cuantity} Total Pesos: ${
        element.price * element.cuantity
      }</p>`;
      document.body.append(container);
    });

    let order = {
      user: userName,
      email: userMail,
      id: userId,
      cartId: userCartId,
      Products: data,
    };

    sendMail.addEventListener("click", async () => {
      alert("Pedido enviado");
      fetch("/api/messages/mail", {
        method: "POST",
        body: JSON.stringify(order),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })
        .then((response) => response.json())
        .then((data) => {
         console.log(data)
            inicio()
        });
    });
  });
