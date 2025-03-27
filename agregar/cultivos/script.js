document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async(event) =>{
        event.preventDefault();

        const cropId = document.querySelector('.form__input--idCultivo');
        const cropType = document.querySelector('.form__input--typeCrop');
        const cropName = document.querySelector('.form__input--name');
        const cropIdentifier = document.querySelector('.form__input--cropIdentifier');
        const cropSize = document.querySelector('.form__input--size');
        const cropAddress = document.querySelector('.form__input--address');
        const cropDescription = document.querySelector('.form__input--description');
        const cropImage = document.querySelector('.form__upload-btn');
        const cropState = document.querySelector('.form__input--state');

        const formData = {
            // Evita erroes si algún campo no existe userName ?
            id: cropId ? cropId.value : '',
            tipo: cropType ? cropType.value : '',
            nombre: cropName ? cropName.value : '',
            identificador: cropIdentifier ? cropIdentifier.value : '',
            tamano: cropSize ? cropSize.value : '',
            ubicacion: cropAddress ? cropAddress.value : '',
            descripcion: cropDescription ? cropDescription.value : null,
            fotografia: cropImage ? cropImage.value : null,
            estado: cropState ? cropState.value : '',
        };

        try{
            const response = await fetch('http://localhost:3000/cultivo', {
                method: 'POST',
                // Se está indicando que el cuerpo 
                headers: {
                    'Content-Type': 'application/json'
                },
                // Petición fetch para enviar datos en formato json a el servidor.
                body: JSON.stringify(formData)
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

