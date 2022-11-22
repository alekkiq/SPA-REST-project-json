"use strict";

const lahetajson = (res, jsonresurssi, statuskoodi = 200) => {
    const jsondata = JSON.stringify(jsonresurssi);
    const jsonlength = Buffer.byteLength(jsondata, "utf8");
    res.statusCode = statuskoodi;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", jsonlength);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end(jsondata);
}
const optionsvastaus = (res, statuskoodi = 200) => {
    res.statusCode = statuskoodi;
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "*");
    res.setHeader("Access-Control-Allow-Headers", "Origin, Accept, Content-Type");
    res.setHeader("Content-Length", 0);
    res.end();
}
const lahetahead = (res, jsonresurssi, statuskoodi = 200) => {
    const jsondata = JSON.stringify(jsonresurssi);
    const jsonlength = Buffer.byteLength(jsondata, "utf8");
    res.statusCode = statuskoodi;
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Length", jsonlength);
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.end();
}
const jsonkasittelija = req => new Promise((resolve, reject) => {
    if (req.headers["content-type"] !== "application/json") {
        reject("EI TUETTU TYYPPI")
    }
    else {
        const datapuskuri = [];
        req.on("data", osa => datapuskuri.push(osa));
        req.on("end", () => resolve(JSON.parse(Buffer.concat(datapuskuri).toString())));
        req.on("error", () => reject("tiedonsiirtovirhe"));
    }
});
module.exports = { lahetajson, optionsvastaus, lahetahead, jsonkasittelija };