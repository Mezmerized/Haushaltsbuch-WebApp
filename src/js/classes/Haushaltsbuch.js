"use strict";

class Haushaltsbuch {

    constructor() {
        this._eintraege = [];
        this._monatslistensammlung = new Monatslistensammlung();
        this._gesamtbilanz = new Gesamtbilanz();
    }

    eintragHinzufuegen(formulardaten) {
        let neuerEintrag = new Map();
        neuerEintrag.set("titel", formulardaten.titel);
        neuerEintrag.set("betrag", formulardaten.betrag);
        neuerEintrag.set("typ", formulardaten.typ);
        neuerEintrag.set("datum", formulardaten.datum);
        neuerEintrag.set("timestamp", Date.now());
        this._eintraege.push(neuerEintrag);
        this._eintraegeSortieren();
        this._eintraegeAnzeigen();
        this._gesamtbilanzErstellen();
        this._gesamtbilanzAnzeigen();
    }

    _eintragEntfernen(timestamp) {

        let startIndex;
        for (let i = 0; i < this._eintraege.length; i++) {
            if (this._eintraege[i].get("timestamp") === parseInt(timestamp)) {
                startIndex = i;
                break;
            }
        }

        this._eintraege.splice(startIndex, 1);    
        this._eintraegeAnzeigen();
        this._gesamtbilanzErstellen();
        this._gesamtbilanzAnzeigen();
    }

    _eintraegeSortieren() {
        this._eintraege.sort((eintragA, eintragB) => {
            return eintragA.get("datum") > eintragB.get("datum") ? -1 : eintragA.get("datum") < eintragB.get("datum") ? 1 : 0;
        });
    }

    _htmlEintragGenerieren(eintrag) {

        let listenpunkt = document.createElement("li");
        eintrag.get("typ") === "einnahme" ? listenpunkt.setAttribute("class", "einnahme") :  listenpunkt.setAttribute("class", "ausgabe"),
        listenpunkt.setAttribute("data-timestamp", eintrag.get("timestamp"));

        let datum = document.createElement("span");
        datum.setAttribute("class", "datum");
        datum.textContent = eintrag.get("datum").toLocaleDateString("de-DE", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit"
        });
        listenpunkt.insertAdjacentElement("afterbegin", datum);

        let titel = document.createElement("span");
        titel.setAttribute("class", "titel");
        titel.textContent = eintrag.get("titel");
        datum.insertAdjacentElement("afterend", titel);

        let betrag = document.createElement("span");
        betrag.setAttribute("class", "betrag");
        betrag.textContent = `${(eintrag.get("betrag") / 100).toFixed(2).replace(/\./, ",")} €`;
        titel.insertAdjacentElement("afterend", betrag);

        let button = document.createElement("button");
        button.setAttribute("class", "entfernen-button");
        betrag.insertAdjacentElement("afterend", button);

        let icon = document.createElement("i");
        icon.setAttribute("class", "fas fa-trash");
        button.insertAdjacentElement("afterbegin", icon);

        this._eintragEntfernenEventHinzufuegen(listenpunkt);

        return listenpunkt;
    }

    _eintragEntfernenEventHinzufuegen(listenpunkt) {
        listenpunkt.querySelector(".entfernen-button").addEventListener("click", e => {
            let timestamp = e.target.parentElement.getAttribute("data-timestamp");
            this._eintragEntfernen(timestamp);
        });
    }

    _eintraegeAnzeigen() {

        document.querySelectorAll(".monatsliste ul").forEach(eintragsliste => eintragsliste.remove());
        let eintragsliste = document.createElement("ul");
        this._eintraege.forEach(eintrag => eintragsliste.insertAdjacentElement("beforeend", this._htmlEintragGenerieren(eintrag)));         
        document.querySelector(".monatsliste").insertAdjacentElement("afterbegin", eintragsliste);
    }

    _gesamtbilanzErstellen() {
        let neueGesamtbilanz = new Map();
        neueGesamtbilanz.set("einnahmen", 0);
        neueGesamtbilanz.set("ausgaben", 0);
        neueGesamtbilanz.set("bilanz", 0);
        this._eintraege.forEach(eintrag => {
            switch (eintrag.get("typ")) {
                case "einnahme":
                    neueGesamtbilanz.set("einnahmen", neueGesamtbilanz.get("einnahmen") + eintrag.get("betrag"))
                    neueGesamtbilanz.set("bilanz", neueGesamtbilanz.get("bilanz") + eintrag.get("betrag"))
                    break;
                case "ausgabe":
                    neueGesamtbilanz.set("ausgaben", neueGesamtbilanz.get("ausgaben") + eintrag.get("betrag"))
                    neueGesamtbilanz.set("bilanz", neueGesamtbilanz.get("bilanz") - eintrag.get("betrag"))
                    break;
                default: 
                    console.log(`Der Typ "${eintrag.get("typ")}" ist nicht bekannt!`)
                    break;
            }
        });
        this.gesamtbilanz = neueGesamtbilanz;
    }

    _htmlGesamtbilanzGenerieren() {

        let gesamtbilanz = document.createElement("aside");
        gesamtbilanz.setAttribute("id", "gesamtbilanz");

        let ueberschrift = document.createElement("h1");
        ueberschrift.textContent = "Gesamtbilanz";
        gesamtbilanz.insertAdjacentElement("afterbegin", ueberschrift);

        let einnahmenZeile = document.createElement("div");
        einnahmenZeile.setAttribute("class", "gesamtbilanz-zeile einnahmen")
        let einnahmenTitel = document.createElement("span");
        einnahmenTitel.textContent = "Einnahmen:";
        einnahmenZeile.insertAdjacentElement("afterbegin", einnahmenTitel);
        let einnahmenBetrag = document.createElement("span");
        einnahmenBetrag.textContent = `${(this.gesamtbilanz.get("einnahmen") / 100).toFixed(2).replace(/\./, ",")} €`;
        einnahmenZeile.insertAdjacentElement("beforeend", einnahmenBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", einnahmenZeile);

        let ausgabenZeile = document.createElement("div");
        ausgabenZeile.setAttribute("class", "gesamtbilanz-zeile ausgaben")
        let ausgabenTitel = document.createElement("span");
        ausgabenTitel.textContent = "Ausgaben:";
        ausgabenZeile.insertAdjacentElement("afterbegin", ausgabenTitel);
        let ausgabenBetrag = document.createElement("span");
        ausgabenBetrag.textContent = `${(this.gesamtbilanz.get("ausgaben") / 100).toFixed(2).replace(/\./, ",")} €`;
        ausgabenZeile.insertAdjacentElement("beforeend", ausgabenBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", ausgabenZeile);

        let bilanzZeile = document.createElement("div");
        bilanzZeile.setAttribute("class", "gesamtbilanz-zeile bilanz")
        let bilanzTitel = document.createElement("span");
        bilanzTitel.textContent = "Bilanz:";
        bilanzZeile.insertAdjacentElement("afterbegin", bilanzTitel);
        let bilanzBetrag = document.createElement("span");
        this.gesamtbilanz.get("bilanz") >= 0 ?  bilanzBetrag.setAttribute("class", "positiv") : bilanzBetrag.setAttribute("class", "negativ");
        bilanzBetrag.textContent = `${(this.gesamtbilanz.get("bilanz") / 100).toFixed(2).replace(/\./, ",")} €`;
        bilanzZeile.insertAdjacentElement("beforeend", bilanzBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", bilanzZeile);

        return gesamtbilanz;
    }

    _gesamtbilanzAnzeigen() {

        document.querySelectorAll("#gesamtbilanz").forEach(gesamtbilanz => gesamtbilanz.remove());
        document.querySelector("body").insertAdjacentElement("beforeend", this._htmlGesamtbilanzGenerieren());
    }

}