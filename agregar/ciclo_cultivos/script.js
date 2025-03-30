document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    /* const userList = document.querySelector('.users-list'); */

    form.addEventListener('submit', async(event) =>{
        event.preventDefault();
        const id = document.querySelector('.form__input');
        const idcultivo = document.querySelector('.form__input--id');
        const nameciclo = document.querySelector('.form__input--name');
        const estadociclo = document.querySelector('.form__input--estado');
        const fechainicial = document.querySelector('.form__input--inicial');
        const fechafinal = document.querySelector('.form__input--final');
       /*  const fotografiaInsumo = document.querySelector('.form__label--fotografia'); */
        const descripcionciclo = document.querySelector('.form__input--descripcion');


        const formdata = {
            // Evita erroes si algún campo no existe userName ?
            id : id ? id.value : '',
            id_ciclo : idcultivo? idcultivo.value : '',
            nombre: nameciclo ? nameciclo.value : '',
            estado: estadociclo ? estadociclo.value : '',
            fecha_inicial: fechainicial ? fechainicial.value : '',
            fecha_final: fechafinal ? fechafinal.value : '',
           /*  fotografia: fotografiaInsumo ? fotografiaInsumo.value : '', */
            descripcion: descripcionciclo ? descripcionciclo.value : ''
        };

        try{
            const response = await fetch('http://localhost:3000/ciclo_cultivo', {
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

