document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    const sensorList = document.querySelector('.sensors-list');

    form.addEventListener('submit', async(event) =>{
        event.preventDefault();

        const sensorId = document.querySelector('.form__input--id');
        const sensorNombre = document.querySelector('.form__input--nombre');
        const sensorEstado = document.querySelector('.form__input--estado');
        const sensorTipo = document.querySelector('.form__input--tipo-sensor');
        const sensorUMedida = document.querySelector('.form__input--medida');
        const sensorDescripcion = document.querySelector('.form__input--descripcion');

        const formdata = {
            // Evita erroes si algún campo no existe sensor ?
            id: sensorId ? sensorId.value : '',
            nombre: sensorNombre ? sensorNombre.value : '',
            estado: sensorEstado ? sensorEstado.value : null,
            tipo: sensorTipo ? sensorTipo.value : '',
            unidad_medida: sensorUMedida ? sensorUMedida.value : '',
            fotografia: null, // Si no usas imágenes
            descripcion: sensorDescripcion ? sensorDescripcion.value : null,
        };

        try{
            const response = await fetch('http://localhost:3000/sensor', {
                method: 'POST',
                // Se está indicando que el cuerpo 
                headers: {
                    'Content-Type': 'application/json'
                },
                // Petición fetch para enviar datos en formato json a el servidor.
                body: JSON.stringify(formdata)
            });
            
            if(!response.ok){
                throw new Error('Error en la conexión del servidor');
            }
            
            const result = await response.json();
            console.log('Usuario registrado', result);

            form.reset(); // Limpiar formulario

        } catch(error){
            console.error('Error', error);
        }
    });
})

