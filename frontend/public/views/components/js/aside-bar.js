function loadNavbar() {
  fetch(`${window.location.origin}/frontend/public/views/components/html/aside-bar.html`)
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.text();
    })
    .then(data => {
      document.querySelector('.sidebar').innerHTML = data;
    })
    .catch(error => console.error('Error cargando el navbar:', error));
}

loadNavbar();
