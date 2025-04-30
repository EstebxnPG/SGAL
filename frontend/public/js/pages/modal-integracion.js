
  const modal = document.getElementById('modal-sensor');
  const openModalBtn = document.querySelector('.open-modal-sensor');
  const closeModalBtn = document.querySelector('.modal__close');

  openModalBtn.addEventListener('click', () => {
    modal.classList.remove('hidden');
  });

  closeModalBtn.addEventListener('click', () => {
    modal.classList.add('hidden');
  });

  // Cerrar modal si se hace clic fuera del contenido
  window.addEventListener('click', (e) => {
    if (e.target === modal) {
      modal.classList.add('hidden');
    }
  });

  function abrirModal() {
    document.getElementById('modalIntegracion').style.display = 'block';
}

function cerrarModal() {
    document.getElementById('modalIntegracion').style.display = 'none';
}

window.onclick = function (event) {
    const modal = document.getElementById('modalIntegracion');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
}


