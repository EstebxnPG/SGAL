function inicializarValidaciones() {
    const forms = document.querySelectorAll(".form");

    forms.forEach((form) => {
        form.addEventListener("submit", function (event) {
            event.preventDefault();

            let validarCampo = true;
            const inputs = form.querySelectorAll("input, textarea, select");

            inputs.forEach((input) => {
                let errorSpan = input.nextElementSibling;

                if (!errorSpan || !errorSpan.classList.contains("error-message")) {
                    errorSpan = document.createElement("span");
                    errorSpan.classList.add("error-message");
                    errorSpan.style.color = "red";
                    input.insertAdjacentElement("afterend", errorSpan);
                }

                if (input.value.trim() === "") {
                    validarCampo = false;
                    errorSpan.textContent = `El campo es obligatorio.`;
                } else {
                    errorSpan.textContent = "";
                }
            }); 

            if (validarCampo) {
                alert("Formulario enviado correctamente.");
            }
        });
    });
}

setTimeout(() => {
    console.log("LLAMAMOS LA FUNCION.");
    inicializarValidaciones();
}, 100);


document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".login__form");

    form.addEventListener("submit", function (e) {
        e.preventDefault(); // Evita la redirección automática

        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (validarFormulario(email, password)) {
            window.location.href = "../../../index.html";
        } else {
        }
    });

    function validarFormulario(email, password) {
        if (email === "" || password === "") {
            return false;
        }   
        return true;
    }
});
