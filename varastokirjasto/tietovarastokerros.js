"use strict";

function luotietovarasto(statuspolku, varastofunktiopolku, varastotiedostopolku) {
    const { STATUSKOODIT, STATUSVIESTIT } = require(statuspolku);
    const { luovarastokerros } = require(varastofunktiopolku);
    const {
        haekaikkivarastosta,
        haeyksivarastosta,
        lisaavarastoon,
        poistavarastosta,
        paivitavarasto,
        perusavain
    } = luovarastokerros(varastotiedostopolku);

    class Tietovarasto {
        get STATUSKOODIT() {
            return STATUSKOODIT;
        }
        haeKaikki() {
            return haekaikkivarastosta();
        }
        hae(arvo) {
            return new Promise(async (resolve, reject) => {
                if (!arvo) {
                    reject(STATUSVIESTIT.EI_LOYTYNYT("tyhjä"));
                }
                else {
                    const tulos = await haeyksivarastosta(arvo);
                    if (tulos) {
                        resolve(tulos);
                    }
                    else {
                        reject(STATUSVIESTIT.EI_LOYTYNYT(arvo));
                    }
                }
            });
        }
        lisaa(uusi) {
            return new Promise(async (resolve, reject) => {
                if (uusi) {
                    if (await lisaavarastoon(uusi)) {
                        resolve(STATUSVIESTIT.LISAYS_OK(uusi[perusavain]));
                    }
                    else {
                        reject(STATUSVIESTIT.EI_LISATTY());
                    }
                }
                else {
                    reject(STATUSVIESTIT.EI_LISATTY());
                }
            });
        }
        poista(arvo) {
            return new Promise(async (resolve, reject) => {
                if (!arvo) {
                    reject(STATUSVIESTIT.EI_LOYTYNYT("tyhjä"));
                }
                else if (await poistavarastosta(arvo)) {
                    resolve(STATUSVIESTIT.POISTO_OK(arvo));
                }
                else {
                    reject(STATUSVIESTIT.EI_POISTETTU());
                }
            });
        }
        paivita(muutettuOlio, avain) {
            return new Promise(async (resolve, reject) => {
                if (muutettuOlio && avain) {
                    if (muutettuOlio[perusavain] !== avain) {
                        reject(STATUSVIESTIT.PERUSAVAIN_RISTIRIITAINEN(muutettuOlio[perusavain], avain));
                    }
                    else if (await haeyksivarastosta(muutettuOlio[perusavain])) {
                        if (await paivitavarasto(muutettuOlio)) {
                            resolve(STATUSVIESTIT.PAIVITYS_OK(muutettuOlio[perusavain]));
                        }
                        else {
                            reject(STATUSVIESTIT.EI_PAIVITETTY());
                        }
                    }
                    else if (await lisaavarastoon(muutettuOlio)) {
                        resolve(STATUSVIESTIT.LISAYS_OK(muutettuOlio[perusavain]));
                    }
                    else {
                        reject(STATUSVIESTIT.EI_LISATTY());
                    }
                }
                else {
                    reject(STATUSVIESTIT.EI_PAIVITETTY());
                }
            });
        }
    }
    return new Tietovarasto();
}
module.exports = { luotietovarasto };
