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

    eintragAusgeben() {
        console.clear();
        this.eintraege.forEach(function(eintrag) {
            console.log(`Titel: ${eintrag.get("titel")}\n`
                + `Typ: ${eintrag.get("typ")}\n`
                + `Betrag: ${(eintrag.get("betrag") / 100).toFixed(2)} €\n`
                + `Datum: ${eintrag.get("datum").toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                })}`
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
            if (this.fehler.length === 0) {
                this.eintraegeSortieren();
                this.eintragAusgeben();
                this.gesamtbilanzErstellen();
                this.gesamtbilanzAusgeben();
            } else {
                this.fehler = [];
            }
            neuerEintrag = confirm("Weiterer Eintrag hinzufügen?");
        }
    }
};

haushaltsbuch.eintragHinzufuegen();
console.log(haushaltsbuch)