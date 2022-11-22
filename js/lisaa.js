"use strict";

(function () {
    let valmistusnroInput;
    let merkkiInput;
    let rekisteriNroInput;
    let huippunopeusInput;
    let vuosimalliInput;
    document.addEventListener("DOMContentLoaded", alusta);

    function alusta() {
        valmistusnroInput = document.getElementById("valmistusnro");
        merkkiInput = document.getElementById("merkki");
        rekisteriNroInput = document.getElementById("rekisteriNro");
        huippunopeusInput = document.getElementById("huippunopeus");
        vuosimalliInput = document.getElementById("vuosimalli");

        document.getElementById("laheta").addEventListener("click", laheta);
    }

    async function laheta() {
        tyhjennaViestiAlue();
        const auto = {
            valmistusnro: +valmistusnroInput.value,
            merkki: merkkiInput.value,
            rekisteriNro: rekisteriNroInput.value,
            huippunopeus: +huippunopeusInput.value,
            vuosimalli: +vuosimalliInput.value
        };
        try {
            const optiot = {
                method: "POST",
                mode: "cors",
                body: JSON.stringify(auto),
                headers: {
                    "Content-Type": "application/json"
                }
            };
            const data = await fetch(`http://localhost:4000/api/autot`, optiot);
            const tulosJson = await data.json();

            if (tulosJson.viesti) {
                paivitaViestiAlue(tulosJson.viesti, tulosJson.tyyppi);
            }
        }
        catch (virhe) {
            paivitaViestiAlue(virhe.message, "virhe");
        }
    }
})();