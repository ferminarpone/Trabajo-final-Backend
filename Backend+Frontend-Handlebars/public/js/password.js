const form = document.getElementById("EmailPswForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  const data = new FormData(form);
  const obj = {};
  data.forEach((value, key) => (obj[key] = value));
  fetch("api/email/sendEmailToResetPass", {
    method: "POST",
    body: JSON.stringify(obj),
    headers: {
      "Content-Type": "application/json",
    },
  }).then((result) => {
    if (result.status === 200) {
        Swal.fire({
            icon: "success",
            text: `Revise su correo electronico`,
            width: 400,
          });
        }else {
      Swal.fire({
        icon: "error",
        text: `El usuario ingresado, no existe.`,
        width: 400,
      });
    }
  });
}); 
