const API_URL_RECORDATORIO = "http://localhost:4000/recordatorio";
document.addEventListener("DOMContentLoaded", () => {  
  obtenerRecordatorios();

  document.getElementById("recordatorio-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();
      const id_vehiculo = document.getElementById("id_vehiculo-input");
      
      const tipo_recordatorio = document.getElementById(
        "tipo_recordatorio-input");
      const fecha_vencimiento = document.getElementById(
        "fecha_vencimiento-input");
      const estado = document.getElementById("estado-input");

      if (!id_vehiculo || !tipo_recordatorio || !fecha_vencimiento || !estado) {
        alert("Todos los campos son requeridos");
        return;
      }

      await agregarRecordatorio(id_vehiculo.value,tipo_recordatorio.value,fecha_vencimiento.value,estado.value);

      id_vehiculo.value = "";
      tipo_recordatorio.value = "";
      fecha_vencimiento.value = "";
      estado.value = "";

      obtenerRecordatorios();
      //alert("Recordatorio Agregado con Exito");
    });
});

async function obtenerRecordatorios() {
  const listaRecordatorio = document.getElementById("recordatorios-list");
  listaRecordatorio.innerHTML = '';
  try {
    const response = await fetch(`${API_URL_RECORDATORIO}`);
    if (!response.ok)  throw new Error("Error en la respuesta del servidor");
    
    const recordatorios = await response.json();
    recordatorios.forEach((recordatorio) => {
      const row = document.createElement("tr");

      row.innerHTML = `
      <td> <input type ="text" value="${recordatorio.id_recordatorio}" readonly>
                </td>
                <td> <input type ="text" value="${recordatorio.id_vehiculo}">
                </td>
                <td> <input type ="text" value="${recordatorio.tipo_recordatorio}">
                </td>
                <td><input type ="text" value="${recordatorio.fecha_vencimiento}">
                </td>
                <td><input type="text" value="${recordatorio.estado}">
                </td>
                <td>
                <button class="mdl-button mdl-js-button mdl-button--icon btn-guardar">💾</button>
                <button class="mdl-button mdl-js-button mdl-button--icon btn-eliminar"> 🚮  </button>
                </td>
            `;

      const btnEliminar = row.querySelector('.btn-eliminar');
      const btnGuardar = row.querySelector('.btn-guardar');

      const inputIdRecordatorio = row.querySelector("td:nth-child(1)")
      const inputIdVehiculo = row.querySelector("td:nth-child(2) input");
      const inputTipoRecordatorio = row.querySelector("td:nth-child(3) input");
      const inputFechaVencimiento = row.querySelector("td:nth-child(4) input");
      const inputEstado = row.querySelector("td:nth-child(5) input");
     
      if( btnGuardar && inputIdVehiculo && inputTipoRecordatorio && inputFechaVencimiento && inputEstado)
        {
          btnGuardar.onclick = async () => {
          await actualizarRecordatorio(
            recordatorio.id_recordatorio,
            inputIdVehiculo.value,
            inputTipoRecordatorio.value,
            inputFechaVencimiento.value,
            inputEstado.value,
             );
             obtenerRecordatorios();
             return;
           };        
        }

      btnEliminar.onclick = async () => {
        await eliminarRecordatorio(recordatorio.id_recordatorio);
        obtenerRecordatorios();
      };
      
      row.appendChild(btnEliminar);
      listaRecordatorio.appendChild(row);

    });
   
  } catch (error) {
    console.error("Error al registrar el recordatorio", error);
    //alert("Error al cargar el recordatorio");
  }
}

async function agregarRecordatorio(id_vehiculo, tipo_recordatorio,
  fecha_vencimiento,estado)
   {
    try {
        const fechaFormat = new Date(fecha_vencimiento).toISOString();
        await fetch(API_URL_RECORDATORIO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id_vehiculo,tipo_recordatorio,
            fecha_vencimiento: fechaFormat,estado})
        });
    
  } catch (error) {
    console.error("Error", error);
  }
}

async function actualizarRecordatorio(id,id_vehiculo, tipo_recordatorio,fecha_vencimiento,estado)
 {

  try {
    const fechaFormat = new Date(fecha_vencimiento).toISOString();
    console.log("Datos a actualizar:", {
      id,
      id_vehiculo,
      tipo_recordatorio,
      fecha_vencimiento: fechaFormat,
      estado
    });  
     
    const response = await fetch(`${API_URL_RECORDATORIO}/${id}`, 
    {
      method: "PUT",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({id_vehiculo, tipo_recordatorio,
        fecha_vencimiento:fechaFormat,estado}),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar:", error);
    
  }
}

async function eliminarRecordatorio(id) {
  try {
    const response = await fetch(`${API_URL_RECORDATORIO}/${id}`, {
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
