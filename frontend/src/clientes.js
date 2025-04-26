const API_URL='http://localhost:4000/clientes';
document.addEventListener('DOMContentLoaded',()=>{
    obtenerClientes();
    
});

//Obtener Clientes 
async function obtenerClientes() {
  const listaCliente= document.getElementById("clientes-list");
  listaCliente.innerHTML='';
  try {
    const response = await fetch(`${API_URL}`);
    const clientes = await response.json();
    clientes.forEach((cliente) => {
              const item = document.createElement("tr");
              //item.textContent = cliente.nombre+cliente.email+" "+cliente.telefono;
              item.innerHTML = `
              <th> <input type="text" value= "${cliente.nombre}"></th>
              <th> <input type="text" value= "${cliente.email}"></th>
              <th> <input type="text" value= "${cliente.telefono}"></th>
              <th>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-eliminar">
                  🚮
              </button> 
              </th>
              <th>
              <button class="mdl-button mdl-js-button mdl-button--icon mdl-button--colored btn-guardar">
                  💾
              </button> 
              </th>`;
              
              // Body
              const btnEliminar = item.querySelector('.btn-eliminar');
              const btnGuardar = item.querySelector('.btn-guardar');
              const inputNombre=item.querySelector ("th:nth-child(1) input");
              
              const inputEmail=item.querySelector ("th:nth-child(2) input");
              const inputTelefono=item.querySelector ("th:nth-child(3) input");

              //Actualizar cliente
              if (btnGuardar && inputNombre && inputEmail && inputTelefono) {
                btnGuardar.onclick = async () => {
                    await actualizarCliente(cliente.id_cliente, inputNombre.value, inputEmail.value, inputTelefono.value);
                    obtenerClientes();
                };
            }
              
              //btnEliminar.textContent = "🚮";
              btnEliminar.onclick = async()=>{
                await eliminarCliente(cliente.id_cliente);
                obtenerClientes();
              }
              item.appendChild(btnEliminar);
              listaCliente.appendChild(item);

    });
  } catch (error) {
    console.error("Error", error);
  }
}

document.addEventListener('DOMContentLoaded',()=>{
  obtenerClientes();

  document.getElementById("cliente-form").addEventListener("submit",async(e)=>{
    e.preventDefault();
    const nombre = document.getElementById("nombre-input");
    const email = document.getElementById("email-input");
    const telefono = document.getElementById("telefono-input");
    await agregarcliente(nombre.value,email.value,telefono.value);
    nombre.value="";
    email.value="";
    telefono.value="";
    obtenerClientes();

  });
});

//Agregar un cliente

/*async function agregarCliente1(nombre, email, telefono){
  try{
    const response= await fetch(API_URL, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nombre, email, telefono})
    });
    if (!response.ok){
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }catch(error)
  {
    console.error('Error',error);
  }
}
*/
async function agregarcliente(nombre,email,telefono){
  try{
     await fetch(API_URL, {

      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({nombre, email, telefono}),

    });
  }catch(error){

    console.error('Error',error);
  }
}

//Actualizar un cliente
async function actualizarCliente(id, nombre, email, telefono) {
  alert(id+nombre+email+telefono);
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, email, telefono }),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

//Eliminar Cliente
async function eliminarCliente(id) {
  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}



