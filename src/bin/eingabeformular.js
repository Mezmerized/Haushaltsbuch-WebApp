"use strict";

const eingabeformular = {

    formulardatenHolen(e) {
        return {
            titel: e.target.elements.titel.value,
            betrag: e.target.elements.betrag.value,
            einnahme: e.target.elements.einnahme.checked,
            datum: e.target.elements.datum.valueAsDate
        }
    },

    formulardatenVerabeiten(formulardaten) {
        return {
            titel:formulardaten.titel.trim(),
            typ: formulardaten.einnahme === false ? "ausgabe" : "einnahme",
            betrag: parseFloat(formulardaten.betrag) * 100,
            datum: formulardaten.datum
        }
    },

    formulardatenValidieren(formulardaten) {
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
    },

    datumAktualisieren() {
        let datumsInput = document.querySelector("#datum");
        if(datumsInput !== null) {
        document.querySelector("#datum").valueAsDate = new Date();
        }
    },

    absendenEventHinzufuegen(eingabeformular) {
        eingabeformular.querySelector("#eingabeformular").addEventListener("submit", e => {
            e.preventDefault();
            let formulardaten = this.formulardatenVerabeiten(this.formulardatenHolen(e));
            let formularFehler = this.formulardatenValidieren(formulardaten);
            if (formularFehler.length === 0) {
                haushaltsbuch.eintragHinzufuegen(formulardaten);
                this.fehlerboxEntfernen();
                e.target.reset();
                this.datumAktualisieren();
            } else {
                this.fehlerboxEntfernen();
                this.fehlerboxAnzeigen(formularFehler);
            }
        });
    },

    htmlFehlerboxGenerieren(formularFehler) {
        let fehlerbox = document.createElement("div");
        fehlerbox.setAttribute("class", "fehlerbox");

        let fehlertext = document.createElement("span");
        fehlertext.textContent = "Folgende Felder wurden nicht korret ausgefüllt:";
        fehlerbox.insertAdjacentElement("afterbegin", fehlertext);

        let fehlerliste = document.createElement("ul");
        formularFehler.forEach(fehler => {
            let fehlerlistenpunkt = document.createElement("li");
            fehlerlistenpunkt.textContent = fehler;
            fehlerliste.insertAdjacentElement("beforeend", fehlerlistenpunkt);
        });

        fehlerbox.insertAdjacentElement("beforeend", fehlerliste);

        return fehlerbox;
    },

    fehlerboxAnzeigen(formularFehler) {
        let eingabeformularContainer = document.querySelector("#eingabeformular-container");
        if (eingabeformularContainer !== null) {
            eingabeformularContainer.insertAdjacentElement("afterbegin", this.htmlFehlerboxGenerieren(formularFehler));
        }
    },

    fehlerboxEntfernen() {
        let bestehendeFehlerbox = document.querySelector(".fehlerbox");
        if (bestehendeFehlerbox !== null) {
            bestehendeFehlerbox.remove();
        }
    },

    htmlGenerieren() {
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
                    <input type="number" id="betrag" name="betrag" form="eingabeformular" placeholder="z.B. 10,42" size="10" step="0.01" title="Betrag des Eintrags (max. zwei Nachkommastellen, kein €-Zeichen)">
                    <label for="datum">Datum</label>
                    <input type="date" id="datum" name="datum" form="eingabeformular" placeholder="jjjj-mm-tt" size="10" title="Datum des Eintrags (Format: jjjj-mm-tt)">
                </div>
            </div>
            <div class="eingabeformular-zeile">
                <button class="standard" type="submit" form="eingabeformular">Hinzufügen</button>
            </div>`;

            this.absendenEventHinzufuegen(eingabeformular);

            return eingabeformular;
    },

    anzeigen() {
        let navigationsleiste = document.querySelector("#navigationsleiste");
        if (navigationsleiste !== null) {
            navigationsleiste.insertAdjacentElement("afterend", this.htmlGenerieren());
            this.datumAktualisieren()};
    }
};