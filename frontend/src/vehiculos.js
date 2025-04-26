const API_URL_VEHICULOS = 'http://localhost:4000/vehiculo'; 

document.addEventListener('DOMContentLoaded', () => {  
  obtenerVehiculos();  
  
  document.getElementById("vehiculo-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    
      const id_cliente = document.getElementById("id_cliente-input");
      const placa = document.getElementById("placa-input");
      const marca = document.getElementById("marca-input");
      const modelo = document.getElementById("modelo-input");
      
      if (!id_cliente || !placa || !marca || !modelo) {
        alert("Todos los campos son requeridos");
        return;
      }
      
      await agregarVehiculo(id_cliente.value, placa.value, marca.value, modelo.value);
      id_cliente.value="";
      placa.value="";
      marca.value="";
      modelo.value="";
      
      //document.getElementById("vehiculo-form").reset();
      
      obtenerVehiculos();
      
      alert("Vehículo agregado correctamente");
    
    
  });
});

async function obtenerVehiculos() {
  const listaVehiculos = document.getElementById("vehiculos-list");
  listaVehiculos.innerHTML = '';
  
  try {
    const response = await fetch(API_URL_VEHICULOS);
    if (!response.ok) throw new Error("Error en la respuesta del servidor");
    
    const vehiculos = await response.json();
    
    vehiculos.forEach((vehiculo) => {
      const row = document.createElement("tr");
      row.innerHTML = `
        <th ><input type="text" value="${vehiculo.id_cliente}"</th>
        <th> <input type="text" value="${vehiculo.placa}">
        </th>
        <th>
            <input type="text" value="${vehiculo.marca}">
        </th>
        <th>
          <input type="text" value="${vehiculo.modelo}">
        </th>
        <th>
          <button class="mdl-button mdl-js-button mdl-button--icon btn-eliminar">
          🚮
          </button>
          <button class="mdl-button mdl-js-button mdl-button--icon btn-guardar">
            💾
          </button>
        </th>
      `;
       const btnEliminar = row.querySelector('.btn-eliminar');
       const btnGuardar = row.querySelector('.btn-guardar');

       const inputIdCliente = row.querySelector("th:nth-child(1) input");
       const inputPlaca = row.querySelector("th:nth-child(2) input")
       const inputMarca = row.querySelector("th:nth-child(3) input")
       const inputModelo = row.querySelector("th:nth-child(4) input")

       if (btnGuardar && inputPlaca && inputMarca && inputModelo) {
         btnGuardar.onclick = async () => {
           await actualizarVehiculo(
            vehiculo.id_vehiculo,
             inputIdCliente.value,
             inputPlaca.value,
             inputMarca.value,
             inputModelo.value
           );
           obtenerVehiculos();
         };
       }
       
       btnEliminar.onclick = async()=>{
        await eliminarVehiculo(vehiculo.id_vehiculo);
        obtenerVehiculos();
       }
       row.appendChild(btnGuardar);
      row.appendChild(btnEliminar);
      listaVehiculos.appendChild(row);
    });
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    alert("Error al cargar los vehículos");
  }
}

async function agregarVehiculo(id_cliente, placa, marca, modelo) {
    try{
    const response = await fetch(API_URL_VEHICULOS, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({id_cliente, placa, marca, modelo})
  });
  
  }catch(error){
    console.error("Error",error);
  }
  
  
}

async function actualizarVehiculo(id, id_cliente, placa, marca, modelo) {
  try {
    const response = await fetch(`${API_URL_VEHICULOS}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_cliente, placa, marca, modelo }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error", error);
  }
}

async function eliminarVehiculo(id) {
    try{
  const response = await fetch(`${API_URL_VEHICULOS}/${id}`, {
    method: "DELETE",
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return await response.json();
}catch(error){
    console.error("Error",error);
}
}