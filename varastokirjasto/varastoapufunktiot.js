"use strict";
const path = require("path");
function luovarastokerros(varastokansiopolku) {
    const varastoconfigpolku = path.join(varastokansiopolku, "jsonconfig.json");
    const {
        varastotiedosto,
        perusavain,
        kasittelija
    } = require(varastoconfigpolku);
    const varastopolku = path.join(varastokansiopolku, varastotiedosto);
    const {
        luevarasto,
        kirjoitavarasto
    } = require(path.join(varastokansiopolku, kasittelija));

    async function haekaikkivarastosta() {
        return luevarasto(varastopolku);
    }
    async function haeyksivarastosta(arvo) {
        return (await luevarasto(varastopolku)).find(ob => ob[perusavain] == arvo) || null;
    }
    async function lisaavarastoon(uusi) {
        const varasto = await luevarasto(varastopolku);
        varasto.push(uusi);
        return await kirjoitavarasto(varastopolku, varasto);
    }
    async function poistavarastosta(arvo) {
        const varasto = await luevarasto(varastopolku);
        const x = varasto.findIndex(alkio => alkio[perusavain] == arvo);
        if (x < 0) {
            return false;
        }
        varasto.splice(x, 1);
        return await kirjoitavarasto(varastopolku, varasto);
    }
    async function paivitavarasto(olio) {
        const varasto = await luevarasto(varastopolku);
        const vanhao = varasto.find(vanha => vanha[perusavain] == olio[perusavain]);
        if (vanhao) {
            Object.assign(vanhao, olio);
            return await kirjoitavarasto(varastopolku, varasto);
        }
        return false;
    }
    return {
        haekaikkivarastosta,
        haeyksivarastosta,
        lisaavarastoon,
        poistavarastosta,
        paivitavarasto,
        perusavain
    }
}
module.exports = { luovarastokerros };