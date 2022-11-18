"use strict";

const haushaltsbuch = {

    gesamtbilanz: new Map(),
    
    eintraege: [],

    eintragErfassen() {
        let neuerEintrag = new Map();
        neuerEintrag.set("titel", prompt("Titel:").trim());
        neuerEintrag.set("typ", prompt("Typ (Einnahme oder Ausgabe):").trim());
        neuerEintrag.set("betrag", this.betragVerarbeiten(prompt("Betrag (in Euro, ohne €-Zeichen):").trim()));
        neuerEintrag.set("datum" , this.datumValidieren(prompt("Datum (jjjj-mm-tt):").trim()));
        neuerEintrag.set("timestamp", Date.now());
        this.eintraege.push(neuerEintrag);
    },

    betragVerarbeiten(betrag) {
        if (this.betragValidieren(betrag)) {
            return parseFloat(betrag.replace(",", ".")) * 100;
        } else {
            console.log(`Ungültiger Betrag: ${betrag} €`);
            return false;
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
        if (this.datumValidieren(datum)) {
            return new datum(`${datum} 00:00:00`);
        } else {
            console.log(`Ungültiges Datumsformat: ${datum}`);
            return false;
        }
        
    },

    datumValidieren(datum) {
        if (datum.match(/^\d{4}-\d{2}-\d{2}$/) !== null) {
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

    eintragAusgeben() {
        console.clear();
        this.eintraege.forEach(function(eintrag) {
            console.log(`Titel: ${eintrag.get("titel")}\n`
                + `Typ: ${eintrag.get("typ")}\n`
                + `Betrag: ${(eintrag.get("betrag") / 100).toFixed(2)} €\n`
                + `Datum: ${eintrag.get("datum")/* .toLocaledateString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                }) */}`
            );
        });

    },

    gesamtbilanzErstellen() {
        let neueGesamtbilanz = new Map();
        neueGesamtbilanz.set("einnahmen", 0);
        neueGesamtbilanz.set("ausgaben", 0);
        neueGesamtbilanz.set("bilanz", 0);
        this.eintraege.forEach(function(eintrag) {
            switch (eintrag.get("typ")) {
                case "Einnahme":
                    neueGesamtbilanz.set("einnahmen", neueGesamtbilanz.get("einnahmen") + eintrag.get("betrag"))
                    neueGesamtbilanz.set("bilanz", neueGesamtbilanz.get("bilanz") + eintrag.get("betrag"))
                    break;
                case "Ausgabe":
                    neueGesamtbilanz.set("ausgaben", neueGesamtbilanz.get("ausgaben") + eintrag.get("betrag"))
                    neueGesamtbilanz.set("bilanz", neueGesamtbilanz.get("bilanz") - eintrag.get("betrag"))
                    break;
                default: 
                    console.log(`Der Typ "${eintrag.get("typ")}" ist nicht bekannt!`)
                    break;
            }
        });
        this.gesamtBilanz = neueGesamtbilanz;
    },

    gesamtbilanzAusgeben() {
        console.log(`Einnahme: ${(this.gesamtBilanz.get("einnahmen") / 100).toFixed(2)} €\n`
            + `Ausgabe: ${(this.gesamtBilanz.get("ausgaben") / 100).toFixed(2)} €\n`
            + `Bilanz: ${(this.gesamtBilanz.get("bilanz") / 100).toFixed(2)} €\n`
            + `Bilanz ist positiv: ${(this.gesamtBilanz.get("bilanz") / 100) >= 0}`
        );
    },

    eintragHinzufuegen() {
        let neuerEintrag = true;
        while (neuerEintrag) {
            this.eintragErfassen();
            this.eintraegeSortieren();
            this.eintragAusgeben();
            this.gesamtbilanzErstellen();
            this.gesamtbilanzAusgeben();
            neuerEintrag = confirm("Weiterer Eintrag hinzufügen?");
        }
    }
};

haushaltsbuch.eintragHinzufuegen();
console.log(haushaltsbuch)