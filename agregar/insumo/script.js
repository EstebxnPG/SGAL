document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('.form');
    /* const userList = document.querySelector('.users-list'); */

    form.addEventListener('submit', async(event) =>{
        event.preventDefault();

        const idInsumo = document.querySelector('.form__input');
        const nameInsumo = document.querySelector('.form__input--nombre-insumo');
        const estadoInsumo = document.querySelector('.form__input--estado');
        const typeInsumo = document.querySelector('.form__input--tipo-insumo');
        const unidadMedida = document.querySelector('.form__input--unidad-medida');
       /*  const fotografiaInsumo = document.querySelector('.form__label--fotografia'); */
        const cantidadInsumo = document.querySelector('.form__input--cantidad');
        const valorunitaroInsumo = document.querySelector('.form__input--valor-unitario');
        const valortotalInsumo = document.querySelector('.form__input--valor-total');
        const descripcionInsumo = document.querySelector('.form__input--descripcion');


        const formdata = {
            // Evita erroes si algún campo no existe userName ?
            id: idInsumo ? idInsumo.value : '',
            nombre: nameInsumo ? nameInsumo.value : '',
            estado: estadoInsumo ? estadoInsumo.value : '',
            tipo: typeInsumo ? typeInsumo.value : '',
            unidad_medida: unidadMedida ? unidadMedida.value : '',
           /*  fotografia: fotografiaInsumo ? fotografiaInsumo.value : '', */
            cantidad: cantidadInsumo ? cantidadInsumo.value : '',
            valor_unitario: valorunitaroInsumo ? valorunitaroInsumo.value : '',
            valor_total: valortotalInsumo ? valortotalInsumo.value : '',
            descripcion: descripcionInsumo ? descripcionInsumo.value : ''
        };

        try{
            const response = await fetch('http://localhost:3000/insumo', {
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

