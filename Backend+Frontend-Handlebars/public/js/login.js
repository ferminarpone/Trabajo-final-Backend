const form = document.getElementById("loginForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("/api/users/login", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
      result.json().then((json) => {
        alert("Login exitoso");
         if(json.role === "User")
         window.location.replace("/products");
         if(json.role === "Admin" || json.role === "Premium") 
         window.location.replace("/products/realtimeproducts"); 
      });
    } else {
      Swal.fire({
        icon: "error",
        text: `Credenciales incorrectas`,
        width: 400,
      });
    }
  });
});
