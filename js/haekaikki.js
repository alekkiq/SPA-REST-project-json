"use strict";

(function () {

    document.addEventListener("DOMContentLoaded", alusta);

    async function alusta() {
        try {
            const data = await fetch(`http://localhost:4000/api/autot`, { mode: "cors" });
            const autot = await data.json();

            const tulosjoukko = document.getElementById("tulosjoukko");
            for (let auto of autot) {
                const tr = document.createElement("tr");
                tr.appendChild(teeSolu(auto.valmistusnro));
                tr.appendChild(teeSolu(auto.merkki));
                tr.appendChild(teeSolu(auto.rekisteriNro));
                tr.appendChild(teeSolu(auto.huippunopeus));
                tr.appendChild(teeSolu(auto.vuosimalli));
                tulosjoukko.appendChild(tr);
            }

        }
        catch (virhe) {
            document.getElementById("tulosalue").innerHtml = `
            <p class="virhe">${virhe.message}</p>`;
        }
    }

    function teeSolu(tieto) {
        const td = document.createElement("td");
        td.textContent = tieto;
        return td;
    }
})();