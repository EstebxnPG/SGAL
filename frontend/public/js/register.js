document.addEventListener('DOMContentLoaded', () => {

    
    const form = document.querySelector('.form');
    // const usersList = document.querySelector('.users-list');    

    // Función para agregar un usuario a la lista
    // const addUserToList = (user) => {
    //     const item = document.createElement('li');
    //     item.textContent = `${user.name} - ${user.email} - ${user.address} - ${user.phone}`;
    //     usersList.appendChild(item);
    // };
    if (!form) return; // Verificar si el formulario existe antes de continuar
    form.addEventListener('submit', async (event) => {
        event.preventDefault(); // Evita la recarga de la página

        const userName = document.querySelector('.form__input--name');
        const userEmail = document.querySelector('.form__input--email');
        const userAddress = document.querySelector('.form__input--address');
        const userPhone = document.querySelector('.form__input--phone');

        const formData = {
            //Evitas errores si algún campo no existe userName ?
            name: userName ? userName.value : '', 
            email: userEmail ? userEmail.value : '',
            address: userAddress?.value || null,  
            phone: userPhone ? userPhone.value : ''
        };

        try {
            const response = await fetch('http://localhost:3000/user', {
                method: 'POST',
                //Se está indicando que el cuerpo de la solicitud esta en formato JSON
                headers: {
                    'Content-Type': 'application/json'
                },
                //Petición fetch para enviar datos en formato JSON al servidor
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Error en la conexión con el servidor');
            }

            const result = await response.json();
            console.log('Usuario registrado:', result);

            form.reset(); // Limpiar formulario después de enviar los datos

        } catch (error) {
            console.error('Error:', error);
        }
    });
});