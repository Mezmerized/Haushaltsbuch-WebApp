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
        this._monatslistensammlung.aktualisieren(this._eintraege);
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
        this._gesamtbilanz.aktualisieren(this._eintraege);
    }

    anzeigen() {
        this._monatslistensammlung.anzeigen();
        this._gesamtbilanz.anzeigen();
    }

}