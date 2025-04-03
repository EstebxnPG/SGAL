document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.register__form');
    const userList = document.querySelector('.users-list');

    form.addEventListener('submit', async(event) =>{
        event.preventDefault();

        const userName = document.querySelector('.register__input--name');
        const userEmail = document.querySelector('.register__input--email');
        const userAdress = document.querySelector('.register__input--address');
        const userCellphone = document.querySelector('.register__input--cellphone');

        const formdata = {
            // Evita erroes si algún campo no existe userName ?
            name: userName ? userName.value : '',
            email: userEmail ? userEmail.value : '',
            address: userAdress ? userAdress.value : null,
            phone: userCellphone ? userCellphone.value : ''
        };

        try{
            const response = await fetch('http://localhost:3000/user', {
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

