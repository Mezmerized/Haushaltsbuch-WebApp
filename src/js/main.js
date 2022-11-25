"use strict";

const haushaltsbuch = {

    gesamtbilanz: new Map(),
    eintraege: [],
    fehler: [],

    eintragErfassen() {
        let neuerEintrag = new Map();
        neuerEintrag.set("titel", this.titelVerarbeiten(prompt("Titel:")));
        neuerEintrag.set("typ", this.typVerarbeiten(prompt("Typ (Einnahme oder Ausgabe):")));
        neuerEintrag.set("betrag", this.betragVerarbeiten(prompt("Betrag (in Euro, ohne €-Zeichen):")));
        neuerEintrag.set("datum", this.datumVerarbeiten(prompt("Datum (jjjj-mm-tt):")));
        neuerEintrag.set("timestamp", Date.now());
        if (this.fehler.length === 0) {
            this.eintraege.push(neuerEintrag);
        } else {
            console.log("Folgende Fehler wurden gefunden:");
            this.fehler.forEach(function(fehler) {
                console.log(fehler);
            });
        }
        
    },

    betragVerarbeiten(betrag) {
        betrag = betrag.trim();
        if (this.betragValidieren(betrag)) {
            return parseFloat(betrag.replace(",", ".")) * 100;
        } else {
            this.fehler.push(`Ungültiger Betrag: ${betrag} €.`);
        }
        
    },

    betragValidieren(betrag) {
        if (betrag.match(/^\d+(?:(?:,|\.)\d\d?)?$/) !== null) {
            return true;
        } else {
            return false;
        }
    },

    datumVerarbeiten(datum) {
        datum = datum.trim();
        if (this.datumValidieren(datum)) {
            return new Date(`${datum} 00:00:00`);
        } else {
            this.fehler.push(`Ungültiges Datumsformat: ${datum}`);
        }
        
    },

    datumValidieren(datum) {
        if (datum.match(/^\d{4}-\d{2}-\d{2}$/) !== null) {
            return true;
        } else {
            return false;
        }
    },

    titelVerarbeiten(titel) {
        titel = titel.trim();
        if (this.titelValidieren(titel)) {
            return titel;
        } else {
            this.fehler.push("Kein Titel angegeben!");
        }
        
    },

    titelValidieren(titel) {
        if (titel !== "") {
            return true;
        } else {
            return false;
        }
    },

    typVerarbeiten(typ) {
        typ = typ.trim().toLowerCase();
        if (this.typValidieren(typ)) {
            return typ;
        } else {
            this.fehler.push(`Ungültiger Eintrags-typ: "${typ}".`);
        }
        
    },

    typValidieren(typ) {
        if (typ.match(/^(?:einnahme|ausgabe)$/)) {
            return true;
        } else {
            return false;
        }
    },

    eintraegeSortieren() {
        this.eintraege.sort(function(eintragA, eintragB) {
            if (eintragA.get("datum") > eintragB.get("datum")) {
                return -1;
            } else if (eintragA.get("datum") < eintragB.get("datum")) {
                return 1;
            } else {
                return 0;
            }
        })
    },

    htmlEintragGenerieren(eintrag) {

        let listenpunkt = document.createElement("li");
        if (eintrag.get("typ") === "einnahme") {
            listenpunkt.setAttribute("class", "einnahme");
        } else if (eintrag.get("typ") === "ausgabe") {
            listenpunkt.setAttribute("class", "ausgabe")
        }
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

        return listenpunkt;

    },

    eintraegeAnzeigen() {

        document.querySelectorAll(".monatsliste ul").forEach(function(eintragsliste) {
            eintragsliste.remove();
        });

        let eintragsliste = document.createElement("ul");
        for (let eintrag of this.eintraege) {
            eintragsliste.insertAdjacentElement("beforeend", this.htmlEintragGenerieren(eintrag));
        }
        document.querySelector(".monatsliste").insertAdjacentElement("afterbegin", eintragsliste);
    },

    gesamtbilanzErstellen() {
        let neueGesamtbilanz = new Map();
        neueGesamtbilanz.set("einnahmen", 0);
        neueGesamtbilanz.set("ausgaben", 0);
        neueGesamtbilanz.set("bilanz", 0);
        this.eintraege.forEach(function(eintrag) {
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
    },

/*     <aside id="gesamtbilanz">
    <h1>Gesamtbilanz</h1>
    <div class="gesamtbilanz-zeile einnahmen"><span>Einnahmen:</span><span>0,00€</span></div>
    <div class="gesamtbilanz-zeile ausgaben"><span>Ausgaben:</span><span>0,00€</span></div>
    <div class="gesamtbilanz-zeile bilanz"><span>Bilanz:</span><span class="positiv">0,00€</span></div>
</aside> */

    htmlGesamtbilanzGenerieren() {

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
        if(this.gesamtbilanz.get("bilanz") >= 0) {
            bilanzBetrag.setAttribute("class", "positiv");
        } else if (this.gesamtbilanz.get("bilanz") < 0) {
            bilanzBetrag.setAttribute("class", "negativ");
        }
        bilanzBetrag.textContent = `${(this.gesamtbilanz.get("bilanz") / 100).toFixed(2).replace(/\./, ",")} €`;
        bilanzZeile.insertAdjacentElement("beforeend", bilanzBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", bilanzZeile);

        return gesamtbilanz;

    },

    gesamtbilanzAnzeigen() {

        document.querySelectorAll("#gesamtbilanz").forEach(function(gesamtbilanz) {
            gesamtbilanz.remove();
        });
        document.querySelector("body").insertAdjacentElement("beforeend", this.htmlGesamtbilanzGenerieren());

    },

    eintragHinzufuegen() {
        let neuerEintrag = true;
        while (neuerEintrag) {
            this.eintragErfassen();
            if (this.fehler.length === 0) {
                this.eintraegeSortieren();
                this.eintraegeAnzeigen();
                this.gesamtbilanzErstellen();
                this.gesamtbilanzAnzeigen();
            } else {
                this.fehler = [];
            }
            neuerEintrag = confirm("Weiterer Eintrag hinzufügen?");
        }
    }
};

haushaltsbuch.eintragHinzufuegen();
console.log(haushaltsbuch)