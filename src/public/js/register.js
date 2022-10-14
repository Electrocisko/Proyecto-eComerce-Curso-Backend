
const form = document.getElementById("registerForm");

const succes = (data) => {
  if (data.status === "error") {
    window.location.assign("http://localhost:8080/errorregister");
  } else {
    window.location.assign("http://localhost:8080/login");
  }
};

const handleSubmit = (evt, target, route) => {
  evt.preventDefault();
  let formData = new FormData(target);
  fetch(route, {
    method: "POST",
    body: formData,
  })
    .then((result) => result.json())
    .then((json) => succes(json));
};

form.addEventListener("submit", (e) => {
  handleSubmit(e, e.target, "/api/sessions/register");
  form.reset();
});
