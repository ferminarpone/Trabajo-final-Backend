const socketClient = io();

const button = document.querySelector("#button");
button.addEventListener("click", (e) => {
  e.preventDefault();
  const title = document.querySelector("#title");
  const description = document.querySelector("#description");
  const code = document.querySelector("#code");
  const price = document.querySelector("#price");
  const stock = document.querySelector("#stock");
  const category = document.querySelector("#category");
  const thumbnail = document.querySelector("#thumbnails");
  const newProduct = {
    title: title.value,
    description: description.value,
    code: code.value,
    price: Number(price.value),
    stock: Number(stock.value),
    category: category.value,
    thumbnail: thumbnail.value,
  };
  socketClient.emit("form_information", newProduct);
  const input = document.querySelectorAll(
    "#title, #description, #code, #price, #stock, #category, #thumbnails"
  );
  input.forEach((e) => (e.value = ""));
});
socketClient.on("products_list", (data) => {
  if (Array.isArray(data)) {
    const div = document.querySelector("#productList");
    let products = " ";
    data.forEach((product) => {
      products += `
      <div class="col-sm-4 mb-4">
      <div class="card" style="width: auto;">
        <img src=${product.thumbnail} class="mx-auto mt-2" alt="..." />
        <div class="card-body">
          <h5 class="card-title">${product.title}</h5>
          <p class="card-text"><strong>Descripción:</strong> ${product.description}</p>
          <p class="card-text"><strong>Categoria:</strong> ${product.category}</p>
          <p class="card-text"><strong>Stock:</strong> ${product.stock}</p>
          <p class="card-text"><strong>Precio:</strong> ${product.price}</p>
          <p class="card-text"><strong>Code:</strong> ${product.code}</p>
          <p class="card-text"><strong>Id:</strong> ${product._id}</p>
          <button class="btn btn-outline-secondary" id="delete${product._id}"> Eliminar Producto </button>
        </div>
      </div>
    </div>
    `;
    });
    div.innerHTML = products;
    data.forEach((prod) => {
      const deleteButton = document.querySelector(`#delete${prod._id}`);
      deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        socketClient.emit("product_delete", prod);
      });
    });
  } else {
    Swal.fire({
      icon: "error",
      text: `${data.error}`,
      width: 400,
    });
  }
}); 

//Home
const home = document.querySelector('#home');
home.addEventListener("click", (e)=>{
  e.preventDefault();
  window.location.replace("/products");
}) 

//Profile
const profile = document.querySelector('#profile');
profile.addEventListener("click", (e)=>{
  e.preventDefault();
  window.location.replace("/users");
})

//Users Manager
const users = document.querySelector('#users');
users.addEventListener("click", (e)=>{
  e.preventDefault();
  fetch("/users-manager").then((result) =>{
    if (result.status === 401) {
      Swal.fire({
        icon: "error",
        text: `Usuario no autorizado: Usuario no encontrado en JWT.`,
        width: 400,
      }).then(()=> window.location.reload());
    }
    if (result.status === 403) {
      Swal.fire({
        icon: "error",
        text: `El usuario no tiene permisos para gestionar usuarios.`,
        width: 400,
      }).then(()=> window.location.reload());
    }
    if (result.status === 200) {
      window.location.replace("/users-manager");
    }
  })
})