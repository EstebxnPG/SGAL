document.addEventListener('DOMContentLoaded', () => {
    // Hacer una petición a la ruta /sensor
    fetch('http://localhost:3000/sensor')
      .then(response => response.json())
      .then(data => {
        const sensorSelect = document.getElementById('sensor');
        sensorSelect.innerHTML = '<option value="">Seleccione un sensor</option>'; 

        data.forEach(sensor => {
          const option = document.createElement('option');
          option.value = sensor.id;
          option.textContent = sensor.nombre;
          sensorSelect.appendChild(option);
        });
      })
      .catch(error => {
        console.error('❌ Error cargando sensores:', error);
      });
  });
/* Cultivos */
  document.addEventListener('DOMContentLoaded', () => {
    // Hacer una petición a la ruta /cultivo
    fetch('http://localhost:3000/cultivo')
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Esto es solo para depurar, y ver qué datos estás recibiendo
  
        const cultivoSelect = document.getElementById('cultivo');
        cultivoSelect.innerHTML = '<option value="">Seleccione un cultivo</option>'; 
  
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(cultivo => {
            const option = document.createElement('option');
            option.value = cultivo.id;
            option.textContent = cultivo.nombre;
            cultivoSelect.appendChild(option);
          });
        } else {
          cultivoSelect.innerHTML = '<option value="">No hay cultivos disponibles</option>';
        }
      })
      .catch(error => {
        console.error('❌ Error cargando cultivo:', error);
      });
  });
  
  /* Insumos */
  document.addEventListener('DOMContentLoaded', () => {
    // Hacer una petición a la ruta /insumo
    fetch('http://localhost:3000/insumo')
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Esto es solo para depurar, y ver qué datos estás recibiendo
  
        const insumoSelect = document.getElementById('insumo');
        insumoSelect.innerHTML = '<option value="">Seleccione un insumo</option>'; 
  
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(insumo => {
            const option = document.createElement('option');
            option.value = insumo.id;
            option.textContent = insumo.nombre;
            insumoSelect.appendChild(option);
          });
        } else {
          insumoSelect.innerHTML = '<option value="">No hay cultivos disponibles</option>';
        }
      })
      .catch(error => {
        console.error('❌ Error cargando insumo:', error);
      });
  });

  /* Ciclo Cultivos */
  document.addEventListener('DOMContentLoaded', () => {
    // Hacer una petición a la ruta /cicloCultivos
    fetch('http://localhost:3000/ciclo_cultivo')
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Esto es solo para depurar, y ver qué datos estás recibiendo
  
        const cicloCultivosSelect = document.getElementById('ciclo_cultivo');
        cicloCultivosSelect.innerHTML = '<option value="">Seleccione un ciclo de cultivos</option>'; 
  
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(cicloCultivos => {
            const option = document.createElement('option');
            option.value = cicloCultivos.id;
            option.textContent = cicloCultivos.nombre;
            cicloCultivosSelect.appendChild(option);
          });
        } else {
          cicloCultivosSelect.innerHTML = '<option value="">No hay ciclos de cultivos disponibles</option>';
        }
      })
      .catch(error => {
        console.error('❌ Error cargando cicloCultivos:', error);
      });
  });

  /* Operadores */
  document.addEventListener('DOMContentLoaded', () => {
    // Hacer una petición a la ruta /operadores
    fetch('http://localhost:3000/usuario')
      .then(response => response.json())
      .then(data => {
        console.log(data);  // Esto es solo para depurar, y ver qué datos estás recibiendo
  
        const operadoresSelect = document.getElementById('operadores');
        operadoresSelect.innerHTML = '<option value="">Seleccione un operador...</option>'; 
  
        if (Array.isArray(data) && data.length > 0) {
          data.forEach(operadores => {
            const option = document.createElement('option');
            option.value = operadores.id;
            option.textContent = operadores.nombre;
            operadoresSelect.appendChild(option);
          });
        } else {  
          operadoresSelect.innerHTML = '<option value="">No hay ciclos de cultivos disponibles</option>';
        }
      })
      .catch(error => {
        console.error('❌ Error cargando Operadores:', error);
      });
  });