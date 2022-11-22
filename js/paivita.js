"use strict";

(function () {
    let valmistusnroInput;
    let merkkiInput;
    let rekisteriNroInput;
    let huippunopeusInput;
    let vuosimalliInput;
    let hakuTila = true;

    document.addEventListener("DOMContentLoaded", alusta);

    function alusta() {
        valmistusnroInput = document.getElementById("valmistusnro");
        merkkiInput = document.getElementById("merkki");
        rekisteriNroInput = document.getElementById("rekisteriNro");
        huippunopeusInput = document.getElementById("huippunopeus");
        vuosimalliInput = document.getElementById("vuosimalli");

        paivitaKentat();

        document.getElementById("laheta")
            .addEventListener("click", laheta);

        valmistusnroInput.addEventListener("focus", tyhjenna);
    }

    function tyhjenna() {
        if (hakuTila) {
            tyhjennaKentat();
            tyhjennaViestiAlue();
        }
    }

    function paivitaKentat() {
        if (hakuTila) {
            valmistusnroInput.removeAttribute("readonly");
            merkkiInput.setAttribute("readonly", true);
            rekisteriNroInput.setAttribute("readonly", true);
            huippunopeusInput.setAttribute("readonly", true);
            vuosimalliInput.setAttribute("readonly", true);
        }
        else {
            valmistusnroInput.setAttribute("readonly", true);
            merkkiInput.removeAttribute("readonly");
            rekisteriNroInput.removeAttribute("readonly");
            huippunopeusInput.removeAttribute("readonly");
            vuosimalliInput.removeAttribute("readonly");
        }
    }

    function paivitaautotiedot(auto) {
        valmistusnroInput.value = auto.valmistusnro;
        merkkiInput.value = auto.merkki;
        rekisteriNroInput.value = auto.rekisteriNro;
        huippunopeusInput.value = auto.huippunopeus;
        vuosimalliInput.value = auto.vuosimalli
        hakuTila = false;
        paivitaKentat();
    }

    function tyhjennaKentat() {
        valmistusnroInput.value = "";
        merkkiInput.value = "";
        rekisteriNroInput.value = "";
        huippunopeusInput.value = "";
        vuosimalliInput.value = "";
        hakuTila = true;
        paivitaKentat();
    }
    async function laheta() {
        try {
            if (hakuTila) {
                tyhjennaViestiAlue();
                const valmistusnro = valmistusnroInput.value;

                const data = await fetch(`http://localhost:4000/api/autot/${valmistusnro}`, { mode: "cors" });
                const hakutulos = await data.json();

                if (hakutulos) {
                    if (hakutulos.viesti) {
                        paivitaViestiAlue(hakutulos.viesti, hakutulos.tyyppi);
                    }
                    else {
                        paivitaautotiedot(hakutulos);
                    }
                }
                else {
                    paivitaViestiAlue("Ei löytynyt", "virhe");
                }
            }
            else {
                const auto = {
                    valmistusnro: +valmistusnroInput.value,
                    merkki: merkkiInput.value,
                    rekisteriNro: rekisteriNroInput.value,
                    huippunopeus: +huippunopeusInput.value,
                    vuosimalli: +vuosimalliInput.value
                };
                const optiot = {
                    method: "PUT",
                    body: JSON.stringify(auto),
                    headers: {
                        "Content-Type": "application/json"
                    }
                };

                const data = await fetch(`http://localhost:4000/api/autot/${auto.valmistusnro}`, optiot);
                const tulosJson = await data.json();

                if (tulosJson.viesti) {
                    paivitaViestiAlue(tulosJson.viesti, tulosJson.tyyppi);
                }
                hakuTila = true;
                paivitaKentat();
            }

        }
        catch (virhe) {
            paivitaViestiAlue(virhe.message, "virhe");
        }
    }
})();