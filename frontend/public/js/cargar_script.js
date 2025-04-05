document.addEventListener("DOMContentLoaded", function () {
    fetch("/config.json")
        .then(response => response.json())
        .then(data => { 
            if (data.script) {
                const script = document.createElement("script");
                script.src = data.script;
                script.type = "text/javascript";
                script.async = false; // Asegura que se ejecute en orden
                document.body.appendChild(script);

                script.onload = function () {
                    console.log(`✅ Script cargado: ${data.script}`);
                };

                script.onerror = function () {
                    console.error(`❌ Error al cargar el script: ${data.script}`);
                };
            } else {
                console.error("⚠️ No se encontró la propiedad 'script' en config.json");
            }
        })
        .catch(error => console.error("❌ Error cargando el JSON:", error));
});
