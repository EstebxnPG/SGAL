document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('.register__form');

  form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const userName = document.querySelector('.register__input--name');
      const userEmail = document.querySelector('.register__input--email');
      const userAddress = document.querySelector('.register__input--address'); 
      const userCellphone = document.querySelector('.register__input--cellphone');

      const formData = {
          name: userName ? userName.value : '', 
          email: userEmail ? userEmail.value : '',
          address: userAddress ? userAddress.value : '', 
          phone: userCellphone ? userCellphone.value : ''
      };

      try {
          const response = await fetch('http://localhost:3000/user', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });

          if (!response.ok) {
              throw new Error('Error en la conexión del servidor');
          }

          const result = await response.json();
          console.log('Usuario registrado:', result);

          form.reset(); // Limpiar formulario
      } catch (error) {
          console.error('Error:', error);
      }
  });
});
