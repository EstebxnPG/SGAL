function loadNavbar() {
    fetch('../components/html/aside-bar.html')
      .then(response => response.text())
      .then(data => {
        document.querySelector('.sidebar').innerHTML = data;
      })
      .catch(error => console.error('Error cargando el navbar:', error));
  }


loadNavbar();