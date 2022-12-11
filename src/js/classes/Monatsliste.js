"use strict";

class Monatsliste {

    constructor(jahr, monat) {
        this._jahr = jahr; 
        this._monat = monat;
        this._eintraege = [];
        this._bilanz = 0;
        this._html = this._htmlGenreiren();
    }

    monat() {
        return this._monat;
    }

    jahr() {
        return this._jahr;
    }

    html() {
        return this._html;
    }

    eintragHinzufuegen(eintrag) {
        this._eintraege.push(eintrag);
        this._aktualisieren();
    }

    _eintraegeSortieren() {
        this._eintraege.sort((eintragA, eintragB) => {
            if (eintragA.datum() > eintragB.datum()) {
                return -1 
            } else if (eintragA.datum() < eintragB.datum()) {
                return 1
            } else {
                if (eintragA.timestamp() > eintragB.timestamp()) {
                    return -1;
                } else {
                    return 1;
                }
            }
        });
    }

    _bilanzieren() {
        let monatsbilanz = 0;
        this._eintraege.forEach(eintrag => {
            if (eintrag.typ() === "einnahme") {
                monatsbilanz += eintrag.betrag();
            } else {
                monatsbilanz -= eintrag.betrag();
            }
        });
        this._bilanz = monatsbilanz;

    }

    _htmlGenreiren() {
        let monatsliste = document.createElement("article");
        monatsliste.setAttribute("class", "monatsliste");

        let ueberschrift = document.createElement("h2");

        let monatJahr = document.createElement("span");
        monatJahr.setAttribute("class", "monat-jahr");
        monatJahr.textContent = `${new Date(this._jahr, this._monat - 1).toLocaleString("de-DE", {
            month: "long",
            year: "numeric"
        })}`;
        ueberschrift.insertAdjacentElement("afterbegin", monatJahr);

        let monatsbilanz = document.createElement("span");
        if (this._bilanz >= 0) {
            monatsbilanz.setAttribute("class", "monatsbilanz positiv");
        } else {
            monatsbilanz.setAttribute("class", "monatsbilanz negativ");
        }
        monatsbilanz.textContent = `${(this._bilanz / 100).toFixed(2).replace(/\./, ",")} €`;
        ueberschrift.insertAdjacentElement("beforeend", monatsbilanz);

        monatsliste.insertAdjacentElement("afterbegin", ueberschrift);

        let eintragsliste = document.createElement("ul");
        this._eintraege.forEach(eintrag => {
            eintragsliste.insertAdjacentElement("beforeend", eintrag.html());
        });
        monatsliste.insertAdjacentElement("beforeend", eintragsliste);

        return monatsliste;

    }

    _aktualisieren() {
        this._eintraegeSortieren();
        this._bilanzieren();
        this._html = this._htmlGenreiren();
    }

}