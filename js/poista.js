"use strict";

(function () {
    let syote;

    document.addEventListener("DOMContentLoaded", alusta);

    function alusta() {
        syote = document.getElementById("valmistusnro");
        document.getElementById("laheta")
            .addEventListener("click", laheta);
    }

    async function laheta() {
        tyhjennaViestiAlue();
        const valmistusnro = syote.value;
        try {
            const optiot = {
                method: "DELETE",
                mode: "cors",
                body: JSON.stringify({ valmistusnro }),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const data = await fetch(`http://localhost:4000/api/autot/${valmistusnro}`, optiot);
            const tulos = await data.json();
            if (tulos.viesti) {
                paivitaViestiAlue(tulos.viesti, tulos.tyyppi);
            }
        }
        catch (virhe) {
            paivitaViestiAlue(virhe.message, "virhe");
        }
    }

})();