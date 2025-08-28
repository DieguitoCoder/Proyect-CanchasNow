document.addEventListener("DOMContentLoaded", () => {
    const options = document.querySelectorAll("input[name='payment']");
    const forms = {
        paypal: document.getElementById("paypal-form"),
        card: document.getElementById("card-form"),
        googlepay: null,
        applepay: null
    };

    // Oculta todos los formularios inicialmente
    function hideAllForms() {
        for (let key in forms) {
            if (forms[key]) forms[key].style.display = "none";
        }
    }
    hideAllForms();

    // Al seleccionar método de pago
    options.forEach(opt => {
        opt.addEventListener("change", () => {
            const value = opt.value;
            hideAllForms();

            if (value === "googlepay") {
                // Redirigir automáticamente
                window.location.href = "https://pay.google.com/";
            } else if (value === "applepay") {
                // Redirigir automáticamente
                window.location.href = "https://www.apple.com/apple-pay/";
            } else if (forms[value]) {
                // Mostrar formulario correspondiente
                forms[value].style.display = "block";
            }
        });
    });
});
