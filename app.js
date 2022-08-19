const button = document.createElement("button");
button.type = "button";
button.className = "buttonNew";
button.id = "buttonSend";
button.innerText = "Enviar formulario";
document.body.appendChild(button);

button.addEventListener("click", () => {
  console.log("click");
});


const comentario = document.querySelector("#exampleFormControlTextarea1");

comentario.addEventListener("keydown", () => {
  console.log("Dejando un comentario...");
});

const nombreInvitado = document.querySelector("#placas")

const titulo = document.querySelector("h1");

titulo.innerHTML += `Bienvenido/a, selecciona un producto`;

buttonForm = document.querySelector("#buttonSend");

buttonForm.addEventListener("click", () => {
  const correo = document.querySelector("#exampleFormControlInput1").value
  localStorage.setItem("Correo", correo)
  const consulta = document.querySelector("#exampleFormControlTextarea1").value
  localStorage.setItem("Consulta" , consulta)
  const text = document.createElement("p");
  text.className = "alert";
  text.innerHTML += "¡Gracias por enviar el formulario!";  
  document.body.appendChild(text);
});


let stock = [];


fetch ('https://manuregatuzo.github.io/ProyectoFinalRegatuzo/stock.json')
.then((response) => response.json())
.then((data) =>  {
  data.forEach((productos) =>{    
    stock.push(productos);
    let cardNueva = document.createElement("div");
    cardNueva.innerHTML =  
      `
      <div class="row">
          <div class="card" style="width: 18rem">
            <img src=${productos.img} class="card-img-top" alt="6800" />
            <div class="card-body">
              <h5 class="card-title">${productos.nombre}</h5>
              <p class="precio">Precio:${productos.precio}</p>
              <p class="precio">ID:${productos.id}</p>

              <button class="btn-gral" onclick= agregarCarrito(${productos.id}) > <img src="img/carrito.png" height="30px" alt="carrito">  </button>
            </div>
          </div>
        </div>
      `;
    document.getElementById("placas").append(cardNueva);
  })
  })

// == AGREGANDO EVENTO ==

const tableBody = document.getElementById( 'tabla-contenedora')

// == CARRITO AGREGAR ELEMENTO Y QUITAR ==
  const carrito = []

let totalCarrito = 0

function agregarCarrito(prodID) {
    let producto = stock.find ( (el) => el.id === prodID)  
    let posicion = 0

    const enJSON    = JSON.stringify(carrito)
    sessionStorage.setItem( "Producto", enJSON) 
    
    let auxiliar = false

    for (let c of carrito) {
        if (c.id == prodID){
            auxiliar = true
            break
        } 
        posicion++
      } 
    
    if (auxiliar){
      carrito[posicion].cantidad++
      
    }
    else {
        carrito.push(producto)
    }

    totalCarrito+=(carrito[posicion].precio)

    mostrarCompra()
    avisoCarrito()
} 

const mostrarCompra = () =>{

    tableBody.innerHTML = ""

    carrito.forEach((productos) =>{
    
    
        const tr = document.createElement('tr')
        tr.className = "table-fondo "
        tr.id = productos.id
        tr.innerHTML += `  
            <th scope="row" > ${productos.nombre}</th>
            <td> ${productos.cantidad} </td>
            <td> $ ${productos.precio*productos.cantidad}</td>
            <td> <button onclick= quitarCarrito(${productos.id}) ><img src="img/logoEliminar.png" alt="eliminar" height="20px"></button> </td>
            
        `

      
        tableBody.appendChild(tr)

        
    })

    let div = document.getElementById("precioTotal") 
    div.innerHTML=` 
    <div class="precioFinal">Total $ ${totalCarrito} </div>    
    `

}

let quitarCarrito = (prodID) => {
  let producto = stock.find ( (el) => el.id === prodID)  
  let pos = carrito.indexOf(producto)

  totalCarrito-=(carrito[pos].precio)

  if (producto.cantidad > 1){
      producto.cantidad--
      
  }else{
      carrito.splice(pos, 1)
  }

  

  mostrarCompra()

  const enJSON    = JSON.stringify(carrito)
  sessionStorage.setItem("Producto", enJSON)

  
}  

let avisoCarrito =() =>{
  if (carrito.length>0){
      const carritoConItems = document.getElementById("carritoModal")
      carritoConItems.innerHTML=`
      <img id="imgCarrito1" src="img/carritoConItem.png" alt="whatsApp" ></img>
      `       
  }else {
      const carritoConItems = document.getElementById("carritoModal")
      carritoConItems.innerHTML=`
      <img id="imgCarrito" src="img/carrito.png" alt="whatsApp" ></img>
      `   
  }
}

// ==MODAL CARRITO ==

const abrirCarrito = document.getElementById("carritoModal");
const cerrarCarrito = document.getElementById("modal-cerrar");
const modalContainer = document.getElementById("modal-container-carrito");



abrirCarrito.addEventListener('click', ()=>{
    modalContainer.classList.add('modal-active')
})

cerrarCarrito.addEventListener('click', ()=>{
    modalContainer.classList.remove('modal-active')
})

// ==MENSAJE COMPRA FINAL==

function msjCompra() {
  Swal.fire({
      position: 'center',
      icon: 'success',
      title: 'Su compra se realizo con exito!',
      showConfirmButton: false,
      timer: 1500
    })
    
}

function msjCompraIncompleta() {
  
  Swal.fire({
      position: 'center',
      icon: 'error',
      title: 'No tiene items en el carro!',
      showConfirmButton: false,
      timer: 1500
    })
}

let finalizarCompra = document.getElementById("btn-finCompra")
finalizarCompra.addEventListener('click', ()=>{  
  localStorage.setItem("Carrito", JSON.stringify(carrito))  
  if(carrito.length>0){
      msjCompra()
  }else{
      msjCompraIncompleta()
  }

modalContainer.classList.remove('modal-active')
})


