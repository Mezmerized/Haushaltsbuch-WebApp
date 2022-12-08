"use strict";

class Haushaltsbuch {

    constructor() {
        this._eintraege = [];
        this._monatslistensammlung = new Monatslistensammlung();
        this._gesamtbilanz = new Gesamtbilanz();
    }

    eintragHinzufuegen(formulardaten) {
        let neuerEintrag = new Eintrag(
            formulardaten.titel, 
            formulardaten.betrag, 
            formulardaten.typ, 
            formulardaten.datum
        );
        this._eintraege.push(neuerEintrag);
        console.log(this);
        this._eintraegeSortieren();
        this._eintraegeAnzeigen();
        this._gesamtbilanz.aktualisieren(this._eintraege);
    }

    eintragEntfernen(timestamp) {

        let startIndex;
        for (let i = 0; i < this._eintraege.length; i++) {
            if (this._eintraege[i].timestamp() === parseInt(timestamp)) {
                startIndex = i;
                break;
            }
        }

        this._eintraege.splice(startIndex, 1);    
        this._eintraegeAnzeigen();
        this._gesamtbilanz.aktualisieren(this._eintraege);
    }

    _eintraegeSortieren() {
        this._eintraege.sort((eintragA, eintragB) => {
            return eintragA.datum() > eintragB.datum() ? -1 : eintragA.datum() < eintragB.datum() ? 1 : 0;
        });
    }

    _eintraegeAnzeigen() {

        document.querySelectorAll(".monatsliste ul").forEach(eintragsliste => eintragsliste.remove());
        let eintragsliste = document.createElement("ul");
        this._eintraege.forEach(eintrag => eintragsliste.insertAdjacentElement("beforeend", eintrag.html()));
        document.querySelector(".monatsliste").insertAdjacentElement("afterbegin", eintragsliste);
    }
}