function loadNavbar() {
    fetch(`${window.location.origin}/frontend/public/views/components/html/search-bar.html`)
      .then(response => response.text())
      .then(data => {
        document.querySelector('.header').innerHTML = data;
      })
      .catch(error => console.error('Error cargando el searchbar:', error));
  }


loadNavbar();