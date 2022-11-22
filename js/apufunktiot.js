"use strict";

function paivitaViestiAlue(viesti, tyyppi){
    const viestialue=document.getElementById("viestialue");
    viestialue.textContent=viesti;
    viestialue.setAttribute("class", tyyppi);
}

function tyhjennaViestiAlue() {
    const viestialue = document.getElementById("viestialue");
    viestialue.textContent = "";
    viestialue.removeAttribute("class");
}
