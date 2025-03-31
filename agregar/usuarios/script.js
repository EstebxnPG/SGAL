document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');

    form.addEventListener('submit', async(event) =>{
        event.preventDefault();

        const userTypeUser = document.querySelector('.form__input--typeUser');
        const userTypeDocument = document.querySelector('.form__input--typeDocument');
        const userNumber = document.querySelector('.form__input--number');
        const userName = document.querySelector('.form__input--name');
        const userEmail = document.querySelector('.form__input--email');
        const userphone = document.querySelector('.form__input--phone');
        const userState = document.querySelector('.form__input--state');
        
        const formData = {
            // Evita erroes si algún campo no existe userName ?
            tipo_usuario: userTypeUser ? userTypeUser.value : '',
            tipo_documento: userTypeDocument ? userTypeDocument.value : '',
            num_documento: userNumber ? userNumber.value : '',
            nombre: userName ? userName.value : '',
            correo: userEmail ? userEmail.value : '',
            num_telefono: userphone ? userphone.value : '',
            estado: userState ? userState.value : '',
            fotografia: null
        };

        try{
            const response = await fetch('http://localhost:3000/usuario', {
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

