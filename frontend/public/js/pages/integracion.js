document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const steps = document.querySelectorAll('.form__step');
    let currentStep = 0;
  
    // Datos de la integración
    const integracionData = {
        sensores: [],
        insumos: [],
        ciclos: [],       // Cambiado de ciclo_cultivos a ciclos
        operadores: []    // Asegurarse que está inicializado
      };
  
    // Manejar navegación entre pasos
    document.querySelectorAll('.form__next').forEach(btn => {
      btn.addEventListener('click', () => {
        if (validateStep(currentStep)) {
          steps[currentStep].classList.remove('form__step--active');
          currentStep++;
          steps[currentStep].classList.add('form__step--active');
        }
      });
    });
  
    document.querySelectorAll('.form__prev').forEach(btn => {
      btn.addEventListener('click', () => {
        steps[currentStep].classList.remove('form__step--active');
        currentStep--;
        steps[currentStep].classList.add('form__step--active');
      });
    });
  
    // Manejar agregar sensores
    document.getElementById('agregarSensor')?.addEventListener('click', () => {
      const select = document.getElementById('sensor');
      const selected = Array.from(select.selectedOptions);
      
      selected.forEach(option => {
        if (!integracionData.sensores.includes(option.value)) {
          integracionData.sensores.push(option.value);
          addToList('lista_sensores', option.text, option.value, 'sensores');
        }
      });
    });
  
    // Manejar agregar insumos (con cantidad)
    document.getElementById('agregarInsumo')?.addEventListener('click', () => {
      const select = document.getElementById('insumo');
      const cantidad = prompt("Ingrese la cantidad:");
      
      if (cantidad && !isNaN(cantidad)) {
        const insumo = {
          id: select.value,
          nombre: select.options[select.selectedIndex].text,
          cantidad: parseFloat(cantidad)
        };
        
        integracionData.insumos.push(insumo);
        addToList('lista_insumos', `${insumo.nombre} (${insumo.cantidad})`, insumo.id, 'insumos');
      }
    });
  
    // CIclos
    document.getElementById('agregarCicloCultivo')?.addEventListener('click', () => {
        const select = document.getElementById('ciclo_cultivo');
        const selected = Array.from(select.selectedOptions);
        
        selected.forEach(option => {
          if (!integracionData.ciclos.includes(option.value)) {
            integracionData.ciclos.push(option.value);
            addToList('lista_ciclos', option.text, option.value, 'ciclos');
          }
        });
      });

      /* operadores */
      document.getElementById('agregarOperadores')?.addEventListener('click', () => {
        const select = document.getElementById('operadores');
        const selected = Array.from(select.selectedOptions);
        
        selected.forEach(option => {
          if (!integracionData.operadores.includes(option.value)) {
            integracionData.operadores.push(option.value);
            addToList('lista_operadores', option.text, option.value, 'operadores');
          }
        });
      });
    // Envío del formulario
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
    
      const formData = new FormData();
      formData.append('nombre', document.querySelector('.form__input--name').value);
      formData.append('cultivo_id', document.getElementById('cultivo').value);
      formData.append('estado', document.querySelector('.form__input--state').value);
      formData.append('fecha_inicial', document.querySelector('.form__input--inicial').value);
      formData.append('fecha_final', document.querySelector('.form__input--final').value);
      
      const fileInput = document.getElementById('fotografia');
      if (fileInput.files.length > 0) {
        formData.append('fotografia', fileInput.files[0]);
      }
    
      // Agregar datos adicionales de integración (si es necesario)
      for (const key in integracionData) {
        formData.append(key, JSON.stringify(integracionData[key]));
      }
    
      try {
        const response = await fetch('http://localhost:3000/integracion', {
          method: 'POST',
          body: formData
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error || 'Error al crear integración');
        }
    
        alert('Integración creada exitosamente!');
        window.location.href = '/frontend/public/views/gestion/integracion.html';
        form.reset();
        Object.keys(integracionData).forEach(key => integracionData[key] = []);
        document.querySelectorAll('[id^="lista_"]').forEach(el => el.innerHTML = '');
    
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    });
    
  });
  
  function addToList(listId, text, value, type) {
    const list = document.getElementById(listId);
    const item = document.createElement('div');
    item.className = 'selected-item';
    item.innerHTML = `
      <span>${text}</span>
      <button type="button" onclick="removeFromList(this, '${type}', '${value}')">×</button>
    `;
    list.appendChild(item);
  }
  
  function removeFromList(element, type, value) {
    const parent = element.parentElement;
    parent.remove();
    
    if (type === 'insumos') {
      window.integracionData[type] = window.integracionData[type].filter(i => i.id !== value);
    } else {
      window.integracionData[type] = window.integracionData[type].filter(id => id !== value);
    }
  }   
  
  function validateStep(step) {
    // Implementar validación para cada paso
    return true;
  }

  document.addEventListener('DOMContentLoaded', async () => {
    // Cargar integraciones al iniciar la página
    await cargarIntegraciones();
    
    // ... (el resto de tu código existente)
});
document.addEventListener('DOMContentLoaded', async () => {
    // Cargar integraciones al iniciar
    await cargarIntegraciones();
    
    // Resto de tu código existente para el formulario...
    const form = document.querySelector('.form');
    const steps = document.querySelectorAll('.form__step');
    // ... (todo el resto de tu código de formulario)
});

// Mueve estas funciones fuera del event listener
async function cargarIntegraciones() {
    try {
        const response = await fetch('http://localhost:3000/integracion/integraciones');
        const integraciones = await response.json();

        if (!response.ok) {
            throw new Error(integraciones.error || 'Error al cargar integraciones');
        }

        renderizarIntegraciones(integraciones);
    } catch (error) {
        console.error('Error:', error);
    }
}

function renderizarIntegraciones(integraciones) {
    const gridContainer = document.querySelector('.users-grid');
    gridContainer.innerHTML = ''; // Limpiar contenedor
    
    if (integraciones.length === 0) {
        gridContainer.innerHTML = '<p class="no-data">No hay integraciones registradas</p>';
        return;
    }
    
    integraciones.forEach(integracion => {
        gridContainer.appendChild(crearCardIntegracion(integracion));
    });
}

function crearCardIntegracion(integracion) {
  const card = document.createElement('div');
  card.className = 'user-card';
  
  // Construir la URL de la imagen con manejo de errores
  const imagenUrl = integracion.fotografia 
      ? `http://localhost:3000/uploads/${integracion.fotografia}`
      : '/frontend/public/img/integrados_cultivos.jpg';

  // Manejo seguro del estado (por si es undefined)
  const estado = integracion.estado ? integracion.estado.toUpperCase() : 'SIN ESTADO';

  card.innerHTML = `
      <a href="/frontend/public/views/ver_integracion.html?id=${integracion.id}" class="card__integracion">
          <div class="user-card__avatar">
              <img src="${imagenUrl}" 
                   alt="Imagen de ${integracion.nombre || 'Integración'}"
                   onerror="this.onerror=null;this.src='/frontend/public/img/integrados_cultivos.jpg'">
          </div>
          <div class="user-card__info">
              <div class="user-card__id"><p><b>ID:</b> ${integracion.id}</p></div>
              <div class="user-card__name"><p><b>Integración:</b> ${integracion.nombre || 'No asignado'}</p></div>
              <div class="user-card__role"><p><b>Cultivo:</b> ${integracion.cultivo_nombre || 'No especificado'}</p></div>
              <div class="user-card__status"><p><b>Estado:</b> ${estado}</p></div>
          </div>
      </a>
      <div class="user-card__actions">
          <button class="user-card__edit-btn" 
                  onclick="location.href='../modificar/modificar_integración.html?id=${integracion.id}'">
              Editar
          </button>
          <button class="user-card__delete-btn" 
                  onclick="eliminarIntegracion(${integracion.id}, this)">
              Eliminar
          </button>
      </div>
  `;
  
  return card;
}

async function eliminarIntegracion(id) {
    if (confirm('¿Estás seguro de que deseas eliminar esta integración?')) {
        try {
            const response = await fetch(`http://localhost:3000/integracion/${id}`, {
                method: 'DELETE'
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al eliminar integración');
            }
            
            await cargarIntegraciones();
            mostrarExito('Integración eliminada exitosamente');
        } catch (error) {
            console.error('Error:', error);
            mostrarError(error.message);
        }
    }
}

function mostrarError(mensaje) {
    // Implementa cómo mostrar errores en tu UI
    alert(mensaje); // Esto es temporal, puedes mejorarlo
}

function mostrarExito(mensaje) {
    // Implementa cómo mostrar mensajes de éxito
    alert(mensaje); // Esto es temporal, puedes mejorarlo
}