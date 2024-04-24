

//Boton Agregar carrito
document.addEventListener('DOMContentLoaded', ()=> {
  const cid = document.querySelector("#idCart").dataset.cartId;
  const addCartButtons = document.querySelectorAll('.addCartBtn');
  addCartButtons.forEach((btn) => {
      btn.addEventListener('click', (e)=> {
          const pid = e.target.dataset.productId;
           fetch(`/api/carts/${cid}/product/${pid}`,{
           method: "POST",
           headers: {
             "Content-Type": "application/json",
           },
          }).then((result) => {
            if (result.status === 200) {
               window.location.replace("/products/cart");
            }
            if(result.status === 403){
              Swal.fire({
                icon: "error",
                title: "Admin user",
                text: `No es posible realizar una compra como Administrador.`,
                width: 400,
              }).then(()=> window.location.reload());
            }
            if(result.status === 404){
              result.json().then((json) => {
                if(json.error === "Stock insuficiente"){
                  Swal.fire({
                    icon: "error",
                    text: `No es posible agregar productos sin stock al carrito.`,
                    width: 400,
                  });
                }else{
                  Swal.fire({
                    icon: "error",
                    text: `No es posible agregar productos propios al carrito.`,
                    width: 400,
                  });
                }
            })
            }
          }); 
      });
  });
});

//Ir a perfil
const profile = document.querySelector('#profile');
profile.addEventListener("click", (e)=>{
  e.preventDefault();
  window.location.replace("/users");
})

//Ir a carrito
const cart = document.querySelector('#idCart');
cart.addEventListener("click", (e)=>{
  e.preventDefault();
  window.location.replace("/products/cart");
})
