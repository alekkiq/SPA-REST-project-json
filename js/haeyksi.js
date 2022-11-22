"use strict";

(function () {
    let tulosalue;
    let syote;

    document.addEventListener("DOMContentLoaded", alusta);

    function alusta() {
        tulosalue = document.getElementById("tulosalue");
        syote = document.getElementById("valmistusnro");
        document.getElementById("laheta")
            .addEventListener("click", laheta);
    }

    async function laheta() {
        tyhjennaViestiAlue();
        tulosalue.innerHTML = "";
        const valmistusnro = syote.value;
        try {
            const optiot = {
                method: "POST",
                body: JSON.stringify({ valmistusnro }),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const data = await fetch(`http://localhost:4000/api/autot/${valmistusnro}`);
            const tulosJson = await data.json();
            paivitaSivu(tulosJson);
        }
        catch (virhe) {
            paivitaViestiAlue(virhe.message, "virhe");
        }
    }

    function paivitaSivu(hakutulos) {
        if (hakutulos) {
            if (hakutulos.viesti) {
                paivitaViestiAlue(hakutulos.viesti, hakutulos.tyyppi);
            }
            else {
                paivitaAutotiedot(hakutulos);
            }
        }
        else {
            paivitaViestiAlue("Ei löytynyt", "virhe");
        }
    }

    function paivitaAutotiedot(auto) {
        tulosalue.innerHTML = `
        <p><span class="selite">Valmistusnumero:</span> ${auto.valmistusnro}</p>
        <p><span class="selite">Merkki:</span> ${auto.merkki}</p>
        <p><span class="selite">Rekisterinumero:</span> ${auto.rekisteriNro}</p>
        <p><span class="selite">Huippunopeus:</span> ${auto.huippunopeus}</p>
        <p><span class="selite">Vuosimalli:</span> ${auto.vuosimalli}</p>
        `;
        tulosalue.removeAttribute("class");
    }
})();