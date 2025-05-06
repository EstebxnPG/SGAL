document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const integrationId = urlParams.get('id');
    
    if (!integrationId) {
        alert('No se especificó ID de integración');
        window.location.href = '/frontend/public/views/gestion/integracion.html';
        return;
    }

    // Datos de la integración
    const integracionData = {
        sensores: [],
        insumos: [],
        ciclos: [],
        operadores: []
    };

    // Cargar datos de la integración
    try {
        const response = await fetch(`http://localhost:3000/integracion/${integrationId}`);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || 'Error al cargar integración');
        }

        // Llenar formulario con datos existentes
        document.querySelector('.form__input--name').value = data.nombre;
        document.querySelector('.form__input--state').value = data.estado;
        document.querySelector('.form__input--inicial').value = data.fecha_inicial.split('T')[0];
        document.querySelector('.form__input--final').value = data.fecha_final.split('T')[0];
        
        // Mostrar foto actual
        if (data.fotografia) {
            document.getElementById('currentPhoto').innerHTML = `
                <img src="http://localhost:3000/uploads/${data.fotografia}" 
                     alt="Foto actual" style="max-width: 200px; margin-top: 10px;">
                <p>Foto actual</p>
            `;
        }

        // Llenar selects y relaciones
        await cargarSelects(data, integracionData);
        
        // Configurar eventos
        configurarEventos(integrationId, integracionData);

    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
        window.location.href = '/frontend/public/views/gestion/integracion.html';
    }
});

async function cargarSelects(data, integracionData) {
    // Cargar cultivos
    const cultivoSelect = document.getElementById('cultivo');
    const cultivos = await fetch('http://localhost:3000/cultivo').then(res => res.json());
    
    cultivoSelect.innerHTML = '<option value="">Seleccione un cultivo</option>';
    cultivos.forEach(cultivo => {
        const option = document.createElement('option');
        option.value = cultivo.id;
        option.textContent = cultivo.nombre;
        option.selected = data.cultivo_id == cultivo.id;
        cultivoSelect.appendChild(option);
    });

    // Cargar sensores
    const sensorSelect = document.getElementById('sensor');
    const sensores = await fetch('http://localhost:3000/sensor').then(res => res.json());
    
    sensorSelect.innerHTML = '<option value="">Seleccione un sensor</option>';
    sensores.forEach(sensor => {
        const option = document.createElement('option');
        option.value = sensor.id;
        option.textContent = sensor.nombre;
        sensorSelect.appendChild(option);
    });

    // Agregar sensores existentes a la lista
    data.sensores.forEach(sensor => {
        addToList('lista_sensores', sensor.nombre, sensor.id, 'sensores');
        integracionData.sensores.push(sensor.id.toString());
    });

    // Cargar insumos
    const insumoSelect = document.getElementById('insumo');
    const insumos = await fetch('http://localhost:3000/insumo').then(res => res.json());
    
    insumoSelect.innerHTML = '<option value="">Seleccione un insumo</option>';
    insumos.forEach(insumo => {
        const option = document.createElement('option');
        option.value = insumo.id;
        option.textContent = insumo.nombre;
        insumoSelect.appendChild(option);
    });

    // Agregar insumos existentes a la lista
    data.insumos.forEach(insumo => {
        const item = {
            id: insumo.id,
            nombre: insumo.nombre,
            cantidad: insumo.cantidad
        };
        addToList('lista_insumos', `${insumo.nombre} (${insumo.cantidad})`, insumo.id, 'insumos');
        integracionData.insumos.push(item);
    });

    // Cargar ciclos de cultivo
    const cicloSelect = document.getElementById('ciclo_cultivo');
    const ciclos = await fetch('http://localhost:3000/ciclo_cultivo').then(res => res.json());
    
    cicloSelect.innerHTML = '<option value="">Seleccione un ciclo</option>';
    ciclos.forEach(ciclo => {
        const option = document.createElement('option');
        option.value = ciclo.id;
        option.textContent = ciclo.nombre;
        cicloSelect.appendChild(option);
    });

    // Agregar ciclos existentes a la lista
    data.ciclos.forEach(ciclo => {
        addToList('lista_ciclos', ciclo.nombre, ciclo.id, 'ciclos');
        integracionData.ciclos.push(ciclo.id.toString());
    });

    // Cargar operadores
    const operadorSelect = document.getElementById('operadores');
    const operadores = await fetch('http://localhost:3000/usuario').then(res => res.json());
    
    operadorSelect.innerHTML = '<option value="">Seleccione un operador</option>';
    operadores.forEach(operador => {
        const option = document.createElement('option');
        option.value = operador.id;
        option.textContent = operador.nombre;
        operadorSelect.appendChild(option);
    });

    // Agregar operadores existentes a la lista
    data.operadores.forEach(operador => {
        addToList('lista_operadores', operador.nombre, operador.id, 'operadores');
        integracionData.operadores.push(operador.id.toString());
    });
}

function configurarEventos(integrationId, integracionData) {
    const form = document.querySelector('.form');
    const steps = document.querySelectorAll('.form__step');
    let currentStep = 0;
  
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
  
    // Manejar ciclos de cultivo
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

    // Manejar operadores
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
    
      // Agregar datos adicionales de integración
      for (const key in integracionData) {
        formData.append(key, JSON.stringify(integracionData[key]));
      }
    
      try {
        const response = await fetch(`http://localhost:3000/integracion/${integrationId}`, {
          method: 'PUT',
          body: formData
        });
    
        const data = await response.json();
    
        if (!response.ok) {
          throw new Error(data.error || 'Error al actualizar integración');
        }
    
        alert('Integración actualizada exitosamente!');
        window.location.href = '/frontend/public/views/gestion/integracion.html';
    
      } catch (error) {
        console.error('Error:', error);
        alert(error.message);
      }
    });
}

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