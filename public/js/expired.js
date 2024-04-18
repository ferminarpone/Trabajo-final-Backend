document.addEventListener('DOMContentLoaded', ()=> {
    Swal.fire({
        title: "Sesión expirada",
        text: "Vuleve a loggearte para seguir navengado!",
        icon: "info",
      }).then((result) => {
        window.location.replace("/");
      });
})