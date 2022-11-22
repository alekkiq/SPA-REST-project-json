"use strict";

const http = require("http");
const path = require("path");

const info = `
Käynnistä palvelin antamalla asetustiedosto nimi kometoriville.
`
let configfilenimi = "configREST.json"

if (process.argv.length > 2) {
    configfilenimi = process.argv[2];
}
try {
    kaynnistapalvelin(require(path.join(__dirname, configfilenimi)));
}
catch (virhe) {
    console.log(virhe.message);
    console.log(info);
}

function kaynnistapalvelin(config) {
    const {
        port,
        host,
        varastokirjastokansio,
        varastokansio,
        kirjastokansio,
        resurssi
    } = config

    const varastokirjastopolku = path.join(__dirname, varastokirjastokansio);

    const varastopolku = path.join(__dirname, varastokansio);

    const kirjastopolku = path.join(__dirname, kirjastokansio, "restapufunktiot");

    const statustiedostopolku = path.join(varastokirjastopolku, "statuskoodit");
    const varastofunktiopolku = path.join(varastokirjastopolku, "varastoapufunktiot");

    const { luotietovarasto } = require(path.join(varastokirjastopolku, "tietovarastokerros"));

    const tietovarasto = luotietovarasto(statustiedostopolku, varastofunktiopolku, varastopolku);

    const {
        lahetajson, optionsvastaus, lahetahead, jsonkasittelija
    } = require(kirjastopolku);

    const palvelin = http.createServer(async (req, res) => {
        const { pathname } = new URL(`http://${host}:${port}${req.url}`);
        const reitti = decodeURIComponent(pathname);

        try {
            const metodi = req.method.toUpperCase();
            if (metodi === "OPTIONS") {
                optionsvastaus(res);
            }
            else if (metodi === "HEAD") {
                let body = {};
                if (reitti === `/api/${resurssi}`) {
                    body = await tietovarasto.haeKaikki();
                }
                else if (reitti.startsWith(`/api/${resurssi}/`)) {
                    const osat = reitti.split("/");
                    if (osat.length > 3) {
                        const perusavain = +osat[3];
                        body = await tietovarasto.hae(perusavain);
                    }
                }
                lahetahead(res, body)
            }
            else if (reitti === `/api/${resurssi}`) {
                if (metodi === "GET") {
                    const tulos = await tietovarasto.haeKaikki();
                    lahetajson(res, tulos);
                }
                else if (metodi === "POST") {
                    try {
                        const tulos = await jsonkasittelija(req);
                        const kyselytulos = await tietovarasto.lisaa(tulos);
                        lahetajson(res, kyselytulos);
                    }
                    catch (virhe) {
                        lahetajson(res, virhe, 404);
                    }
                }
            }
            else if (reitti.startsWith(`/api/${resurssi}/`)) {
                const osat = reitti.split("/");
                const perusavain = +osat[3];
                switch (metodi) {
                    case "GET":
                        tietovarasto.hae(perusavain).then(tulosGet => lahetajson(res, tulosGet))
                            .catch(virhe => lahetajson(res, virhe));
                        break;
                    case "DELETE":
                        tietovarasto.poista(perusavain).then(tulosDelete => lahetajson(res, tulosDelete))
                            .catch(virhe => lahetajson(res, virhe));
                        ;
                        break;
                    case "PUT":
                        try {
                            const tulosput = await jsonkasittelija(req);
                            const statusput = await tietovarasto.paivita(tulosput, perusavain);
                            lahetajson(res, statusput);
                        }
                        catch (virhe) {
                            lahetajson(res, virhe);
                        }
                        break;
                    default: lahetajson(res, { viesti: "metodi ei ole käytössä" }, 405);
                }
            }
        }


        catch (virhe) {
            lahetajson(res, { viesti: virhe.message }, 404);
        }
    });
    palvelin.listen(port, host, () => console.log("REST palvelin kuuntelee"));
}