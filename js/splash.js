/* =============================================
   SPLASH V9
   Controla somente a animação de entrada.
============================================= */
const splashScreen = document.getElementById("splashScreen");

function finalizarSplash() {
    if (!splashScreen) return;

    splashScreen.classList.add("finish");

    window.setTimeout(() => {
        splashScreen.classList.add("hide");
        document.body.classList.add("app-ready");
    }, 480);
}

window.addEventListener("load", () => {
    if (!splashScreen) return;

    // Mantém a abertura curta para não atrasar o cliente.
    window.setTimeout(finalizarSplash, 2450);
});
