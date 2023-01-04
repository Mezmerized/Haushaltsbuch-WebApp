/**
 * Das Modul Eingabeformular stellt die Klasse Eingabeformular zur Verfügung.
 * @module classes/Eingabeformular
*/ 

import Fehlerbox from "./Fehlerbox.js";
import liquiPlanner from "../liqui-planner.js";

/**
 * Die Klasse Eingabeformular stellt alle Eigenschaften und Methoden 
 * des Eingabeforulars (inklusive HTML und Events) zur Verfügung.
 */

export default class Eingabeformular {

    /**
     * Der Konstruktor generiert bei Instanziierung der Klasse Eingabeformular das
     * HTML des Eingabeformulars.
     * @prop {Element} _hmtl - das HTML des Eingabeformulars
     */

    constructor() {
        this._html = this._htmlGenerieren();
    }
    

    /**
     * Die private Methode extrahiert die im Eingabeformular eingegebene Daten aus
     * dem Submit-Event des Eingabeformulars.
     * @param {Event} submitEvent - das Submit-Event des Eingabeformulars 
     * @return {Object} - einfaches Objekt mit den Rohdaten des Eingabeformulars
    */

        _formulardatenHolen(submitEvent) {
            return {
                titel: submitEvent.target.elements.titel.value,
                betrag: submitEvent.target.elements.betrag.value,
                einnahme: submitEvent.target.elements.einnahme.checked,
                datum: submitEvent.target.elements.datum.valueAsDate
            }
        }
    
        _formulardatenVerabeiten(formulardaten) {
            return {
                titel:formulardaten.titel.trim(),
                typ: formulardaten.einnahme === false ? "ausgabe" : "einnahme",
                betrag: parseFloat(formulardaten.betrag) * 100,
                datum: formulardaten.datum
            }
        }
    
        _formulardatenValidieren(formulardaten) {
            let fehler = [];
            if (formulardaten.titel === "") {
                fehler.push("Titel");
            }
            if (isNaN(formulardaten.betrag)) {
                fehler.push("Betrag");
            }
            if (formulardaten.datum === null) {
                fehler.push("Datum");
            }
            return fehler;
        }
    
        _datumAktualisieren() {
            let datumsInput = document.querySelector("#datum");
            if(datumsInput !== null) {
            document.querySelector("#datum").valueAsDate = new Date();
            }
        }
    
        _absendenEventHinzufuegen(eingabeformular) {
            eingabeformular.querySelector("#eingabeformular").addEventListener("submit", e => {
                e.preventDefault();
                let formulardaten = this._formulardatenVerabeiten(this._formulardatenHolen(e));
                let formularFehler = this._formulardatenValidieren(formulardaten);
                if (formularFehler.length === 0) {
                    liquiPlanner.eintragHinzufuegen(formulardaten);
                    let bestehendeFehlerbox = document.querySelector(".fehlerbox");
                    if (bestehendeFehlerbox !== null) {
                        bestehendeFehlerbox.remove();
                    }
                    e.target.reset();
                    this._datumAktualisieren();
                } else {
                    let fehler = new Fehlerbox("Folgende Felder wurden nicht korrek ausgefüllt!", formularFehler);
                    fehler.anzeigen();
                }
            });
        }
    
        _htmlGenerieren() {
            let eingabeformular = document.createElement("section");
            eingabeformular.setAttribute("id", "eingabeformular-container");
            eingabeformular.innerHTML = `<form id="eingabeformular" action="#" method="get"></form>
                <div class="eingabeformular-zeile">
                    <h1>Neue Einnahme / Ausgabe hinzufügen</h1>
                </div>
                <div class="eingabeformular-zeile">
                    <div class="titel-typ-eingabe-gruppe">
                        <label for="titel">Titel</label>
                        <input type="text" id="titel" form="eingabeformular" name="titel" placeholder="z.B. Einkaufen" size="10" title="Titel des Eintrags">
                        <input type="radio" id="einnahme" name="typ" value="einnahme" form="eingabeformular" title="Typ des Eintrags">
                        <label for="einnahme" title="Typ des Eintrags">Einnahme</label>
                        <input type="radio" id="ausgabe" name="typ" value="ausgabe" form="eingabeformular" title="Typ des Eintrags" checked>
                        <label for="ausgabe" title="Typ des Eintrags">Ausgabe</label>
                    </div>
                </div>
                <div class="eingabeformular-zeile">
                    <div class="betrag-datum-eingabe-gruppe">
                        <label for="betrag">Betrag</label>
                        <input type="number" id="betrag" name="betrag" form="eingabeformular" placeholder="z.B. 10,42" size="10" step="0.01" min ="0.01" title="Betrag des Eintrags (max. zwei Nachkommastellen, kein €-Zeichen)">
                        <label for="datum">Datum</label>
                        <input type="date" id="datum" name="datum" form="eingabeformular" size="10" title="Datum des Eintrags">
                    </div>
                </div>
                <div class="eingabeformular-zeile">
                    <button class="standard" type="submit" form="eingabeformular">Hinzufügen</button>
                </div>`;
    
                this._absendenEventHinzufuegen(eingabeformular);
    
                return eingabeformular;
        }
    
        anzeigen() {
            let navigationsleiste = document.querySelector("#navigationsleiste");
            if (navigationsleiste !== null) {
                navigationsleiste.insertAdjacentElement("afterend", this._html);
                this._datumAktualisieren()};
        }
}
