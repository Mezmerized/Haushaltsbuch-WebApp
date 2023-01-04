import Monatsliste from "./Monatsliste.js";

export default class Monatslistensammlung {

    constructor() {
        this._monatslisten = [];
        this._html = this._htmlGenerieren();
    }

    _eintragHinzufuegen(eintrag) {
        let eintragsmonat = eintrag.datum().toLocaleString("de-DE", {month: "numeric"});
        let eintragsjahr = eintrag.datum().toLocaleString("de-DE", {year: "numeric"});
        let monatslisteVorhanden = false;
        this._monatslisten.forEach(monatsliste => {
            if (eintragsmonat === monatsliste.monat() && eintragsjahr === monatsliste.jahr()) {
                monatsliste.eintragHinzufuegen(eintrag);
                monatslisteVorhanden = true;
            }
        });
        if (!monatslisteVorhanden) {
            this._monatslisteHinzufuegen(eintragsjahr, eintragsmonat, eintrag);
        }
    }

    _monatslisteHinzufuegen(jahr, monat, eintrag) {
        let neueMonatsliste = new Monatsliste(jahr, monat);
        neueMonatsliste.eintragHinzufuegen(eintrag);
        this._monatslisten.push(neueMonatsliste);
    }

    _monatslistenSortieren() {
        this._monatslisten.sort((monatslisteA, monatslisteB) => {
            if (monatslisteA.jahr() < monatslisteB.jahr()) {
                return 1;
            } else if (monatslisteA.jahr() > monatslisteB.jahr()) {
                return -1;
            } else {
                if (monatslisteA.monat() < monatslisteB.monat()) {
                    return 1;
                } else {
                    return -1;
                }
            }
        });
    };

    _htmlGenerieren() {
        let monatslisten = document.createElement("section");
        monatslisten.setAttribute("id", "monatslisten");

        this._monatslisten.forEach(monatsliste => {
            monatslisten.insertAdjacentElement("beforeend", monatsliste.html());
        });

        return monatslisten;

    }

    aktualisieren(eintraege) {
        this._monatslisten = [];
        eintraege.forEach(eintrag => this._eintragHinzufuegen(eintrag));
        this._monatslistenSortieren();
        this._html = this._htmlGenerieren();
        this.anzeigen();
    }

    anzeigen() {
        let eingabeformularContainer = document.querySelector("#eingabeformular-container");
        let monatslistensammlung = document.querySelector("#monatslisten");
        if (eingabeformularContainer !== null) {
            if (monatslistensammlung !== null) {
                monatslistensammlung.remove();
            }
            eingabeformularContainer.insertAdjacentElement("afterend", this._html);
        }
    }

}