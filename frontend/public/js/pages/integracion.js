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
      
      const formData = {
        nombre: document.querySelector('.form__input--name').value,
        cultivo_id: document.getElementById('cultivo').value,
        estado: document.querySelector('.form__input--state').value,
        fecha_inicial: document.querySelector('.form__input--inicial').value,
        fecha_final: document.querySelector('.form__input--final').value,
        fotografia: null, // Implementar subida de imagen si es necesario
        ...integracionData
      };
  
      try {
        const response = await fetch('http://localhost:3000/integracion', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData)
        });
  
        const data = await response.json();
  
        if (!response.ok) {
          throw new Error(data.error || 'Error al crear integración');
        }
  
        alert('Integración creada exitosamente!');
        window.location.href = '/frontend/public/views/gestion/integracion.html';
        form.reset();
        // Resetear datos
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