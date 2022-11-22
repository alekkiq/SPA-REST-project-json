"use strict";
const fs = require("fs").promises;

async function luevarasto(varastotiedosto) {
    try {
        const data = await fs.readFile(varastotiedosto, "utf8");
        return JSON.parse(data);
    }
    catch (virhe) {
        return [];
    }
}
async function kirjoitavarasto(varastotiedosto, data) {
    try {
        await fs.writeFile(varastotiedosto, JSON.stringify(data, null, 4), {
            encoding: "utf8", flag: "w"
        });
        return true;
    }
    catch (virhe) {
        return false;
    }
}
module.exports = { luevarasto, kirjoitavarasto };