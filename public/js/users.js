//Perfil
const profile = document.querySelector("#profile");
profile.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/users");
});

//Products manager
const products = document.querySelector("#products");
products.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/products/realtimeproducts");
});

//Delete User
document.addEventListener("DOMContentLoaded", () => {
  const deleteUser = document.querySelectorAll(".deleteUser");
  deleteUser.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const uid = e.target.dataset.userId;
      fetch(`/api/users/delete/${uid}`, {
        method: "delete",
      }).then((result) => {
        if (result.status === 200) {
          Swal.fire({
            icon: "success",
            text: `Usuario eliminado exitosamente.`,
            width: 400,
          }).then(() => window.location.reload());
        }
        if (result.status === 400) {
          Swal.fire({
            icon: "error",
            text: `Se ha producido un error al intentar eliminar el usuario.`,
            width: 400,
          }).then(() => window.location.reload());
        }
      });
    });
  });
});

//Change Role
document.addEventListener("DOMContentLoaded", () => {
  const changeRole = document.querySelectorAll(".changeRole");
  changeRole.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const uid = e.target.dataset.userId;
      let role = e.target.dataset.userRol;
        fetch(`/api/users/premium/${uid}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((result) => {
        if (result.status === 200) {
          let title;
          if (role === "User") {
            title = "Rol de usuario modificado a Premium.";
          } else {
            title = "Rol de usuario modificado a User.";
          }
          Swal.fire({
            icon: "success",
            title: title,
            customClass: {
              title: "titleSARol",
            },
            width: 400,
          }).then(()=> window.location.reload());
        }
        if (result.status === 400) {
          Swal.fire({
            icon: "error",
            text: `Para modificar un usuario a Premium el usuario deberá completar la documentación requerida.`,
            width: 400,
          }).then(()=> window.location.reload());
        }
        if (result.status === 404) {
          Swal.fire({
            icon: "error",
            text: `Error al intentar modificar el rol de usuario.`,
            width: 400,
          }).then(()=> window.location.reload());
        }
        if (result.status === 401) {
          Swal.fire({
            icon: "error",
            title: "Usuario Administrador.",
            text: `No es posible modificar el rol.`,
            width: 400,
          }).then(()=> window.location.reload());
        } 
      });
    });
  });
});

//Delete expired users

expiredUsers = document.querySelector("#expiredUsers");
expiredUsers.addEventListener('click', (e)=>{
  e.preventDefault();
  fetch('api/users/delete-expiration-counts', {
    method: "delete"
  }).then((result)=>{
    if (result.status === 200) {
      Swal.fire({
        icon: "success",
        text: `Usuarios expirados, eliminados exitosamente.`,
        width: 400,
      }).then(()=> window.location.reload());
    }
    if (result.status === 204) {
      Swal.fire({
        icon: "info",
        text: `Todos los usuarios se encuentran acutalmente activos.`,
        width: 400,
      }).then(()=> window.location.reload());
    }
    if (result.status === 404) {
      Swal.fire({
        icon: "error",
        text: `Hubo un error al eliminar los usuarios expirados.`,
        width: 400,
      }).then(()=> window.location.reload());
    }
  })

})