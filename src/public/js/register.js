let form = document.getElementById("registerForm");

const succes = (data) => {
  console.log('session router linea 4',data);
  // if (data.status === "error") {
  //   window.location.assign("http://localhost:8080/errorregister");
  // } else {
  //   window.location.assign("http://localhost:8080/");
  // }
};

form.addEventListener("submit", (evt) => {
  try {
    evt.preventDefault();
    let data = new FormData(form);
    let obj = {};
    data.forEach((value, key) => (obj[key] = value));
    fetch("/api/sessions/register", {
      method: "POST",
      body: JSON.stringify(obj),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((result) => result.json())
      .then((json) => succes(json));
    form.reset();
  } catch (error) {
    console.log("Error in register(register.js)", error);
  }
});
