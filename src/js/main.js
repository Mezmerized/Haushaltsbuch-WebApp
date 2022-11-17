"use strict";

const haushaltsbuch = {

    overallBalance: new Map(),
    
    entries: [],

    getEntry() {
        let newEntry = new Map();
        newEntry.set("title", prompt("Titel:"));
        newEntry.set("type", prompt("Typ (Einnahme oder Ausgabe):"));
        newEntry.set("value", parseInt(prompt("Betrag (in Cent:)")));
        newEntry.set("date" , new Date(prompt("Datum (yyyy-mm-dd):") + " 00:00:00"));
        newEntry.set("timestamp", Date.now());
        this.entries.push(newEntry);
    },

    sortEntries() {
        this.entries.sort(function(entryA, entryB) {
            if (entryA.get("date") > entryB.get("date")) {
                return -1;
            } else if (entryA.get("date") < entryB.get("date")) {
                return 1;
            } else {
                return 0;
            }
        })
    },

    entryOutput() {
        console.clear();
        this.entries.forEach(function(entry) {
            console.log(`Titel: ${entry.get("title")}\n`
                + `Typ: ${entry.get("type")}\n`
                + `Betrag: ${entry.get("value")} ct\n`
                + `Datum: ${entry.get("date").toLocaleDateString("de-DE", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit"
                })}`
            );
        });

    },

    createBalance() {
        let newBalance = new Map();
        newBalance.set("income", 0);
        newBalance.set("expense", 0);
        newBalance.set("balance", 0);
        this.entries.forEach(function(entry) {
            switch (entry.get("type")) {
                case "Einnahme":
                    newBalance.set("income", newBalance.get("income") + entry.get("value"))
                    newBalance.set("balance", newBalance.get("balance") + entry.get("value"))
                    break;
                case "Ausgabe":
                    newBalance.set("expense", newBalance.get("expense") + entry.get("value"))
                    newBalance.set("balance", newBalance.get("balance") - entry.get("value"))
                    break;
                default: 
                    console.log(`Der Typ "${entry.get("type")}" ist nicht bekannt!`)
                    break;
            }
        });
        this.overallBalance = newBalance;
    },

    balanceOutput() {
        console.log(`Einnahme: ${this.overallBalance.get("income")} ct\n`
            + `Ausgabe: ${this.overallBalance.get("expense")} ct\n`
            + `Bilanz: ${this.overallBalance.get("balance")} ct\n`
            + `Bilanz ist positiv: ${this.overallBalance.get("balance") >= 0}`
        );
    },

    addEntry() {
        let newEntry = true;
        while (newEntry) {
            this.getEntry();
            this.sortEntries();
            this.entryOutput();
            this.createBalance();
            this.balanceOutput();
            newEntry = confirm("Weiterer Eintrag hinzufügen?");
        }
    }
};

haushaltsbuch.addEntry();
console.log(haushaltsbuch)