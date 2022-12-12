"use strict";

class Haushaltsbuch {

    constructor() {
        this._eintraege = [];
        this._navigationsleiste = new Navigationsleiste();
        this._eingabeformular = new Eingabeformular();
        this._monatslistensammlung = new Monatslistensammlung();
        this._gesamtbilanz = new Gesamtbilanz();
        this._wiederherstellen();
    }

    eintragHinzufuegen(eintragsdaten) {
        let neuerEintrag = new Eintrag(
            eintragsdaten.titel, 
            eintragsdaten.betrag, 
            eintragsdaten.typ, 
            eintragsdaten.datum
        );
        this._eintraege.push(neuerEintrag);
        this._monatslistensammlung.aktualisieren(this._eintraege);
        this._gesamtbilanz.aktualisieren(this._eintraege);
        this._speichern();
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
        this._monatslistensammlung.aktualisieren(this._eintraege);
        this._gesamtbilanz.aktualisieren(this._eintraege);
        this._speichern();
    }

    _speichern() {
        localStorage.setItem("eintraege", JSON.stringify(this._eintraege));
    }

    _wiederherstellen() {
        let gespeicherteEintraege = localStorage.getItem("eintraege");
        if (gespeicherteEintraege !== null) {
            JSON.parse(gespeicherteEintraege).forEach(eintrag => {
                this.eintragHinzufuegen({
                    titel: eintrag._titel,
                    betrag: eintrag._betrag,
                    typ: eintrag._typ,
                    datum: new Date(eintrag._datum)
                });
            });
        }
    }

    start() {
        this._navigationsleiste.anzeigen();
        this._eingabeformular.anzeigen();
        this._monatslistensammlung.anzeigen();
        this._gesamtbilanz.anzeigen();
    }

}