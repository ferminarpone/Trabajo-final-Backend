const purchase = document.querySelector("#purchase");

if (purchase) {
  purchase.addEventListener("click", (e) => {
    const cid = e.target.dataset.purchase;
    fetch(`/api/carts/${cid}/purchase`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((result) => {
      if (result.status === 404) {
        Swal.fire({
          title: "Error de compra.",
          text: "No hay suficiente stock para los productos seleccionados.",
          icon: "error",
        });
      }
      if (result.status === 200) {
        result.json().then((json) => {
          const tid = json.purchase._id;
          window.location.replace(`https://trabajo-final-payments-production.up.railway.app/${tid}`);
        });
      }
    });
  });
}

//Remover producto de carrito
document.addEventListener("DOMContentLoaded", () => {
  const cid = document.querySelector("#idCart").dataset.cartId;
  const removeProdButtons = document.querySelectorAll(".removeProdBtn");
  removeProdButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const pid = e.target.dataset.productId;
      fetch(`/api/carts/${cid}/product/${pid}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }).then((result) => {
        if (result.status === 200) {
          window.location.replace("/products/cart");
        }
        if (result.status === 404) {
          Swal.fire({
            icon: "error",
            text: `Error al remover producto del carrito`,
            width: 400,
          });
        }
      });
    });
  });
});

//Home
const home = document.querySelector("#home");
home.addEventListener("click", (e) => {
  e.preventDefault();
  window.location.replace("/products");
});
