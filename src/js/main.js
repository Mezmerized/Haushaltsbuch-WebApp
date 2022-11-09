"use strict";

const haushaltsbuch = {

    overallBalance: {
        income: 0,
        expense: 0,
        balance: 0
    },

    entries: [],

    GetEntry() {
        this.entries.push(
            {
            title: prompt("Title:"),
            type: prompt("Typ (Einnahme oder Ausgabe):"),
            value: parseInt(prompt("Betrag (in Cent:)")),
            date: prompt("Datum (yyyy-mm-dd):")
            }
        );
    },

EntryOutput() {
        console.clear();
        this.entries.forEach(function(entry) {
            console.log(`Titel: ${entry.title}\n`
                + `Typ: ${entry.type}\n`
                + `Betrag: ${entry.value} ct\n`
                + `Datum: ${entry.date}`
            );
        });

    },

    CreateBalance() {
        let newBalance = {
            income: 0,
            expense: 0,
            balance: 0
        };
        this.entries.forEach(function(entry) {
            switch (entry.type) {
                case "Einnahme":
                    newBalance.income += entry.value;
                    newBalance.balance += entry.value;
                    break;
                case "Ausgabe":
                    newBalance.expense += entry.value;
                    newBalance.balance -= entry.value;
                    break;
                default: 
                    console.log(`Der Typ "${entry.type}" ist nicht bekannt!`)
                    break;
            }
        });
        this.overallBalance = newBalance;
    },

    BalanceOutput() {
        console.log(`Einnahme: ${this.overallBalance.income} ct\n`
            + `Ausgabe: ${this.overallBalance.expense} ct\n`
            + `Bilanz: ${this.overallBalance.balance} ct\n`
            + `Bilanz ist positiv: ${this.overallBalance.balance >= 0}`
        );
    },

    AddEntry() {
        let newEntry = true;
        while (newEntry) {
            this.GetEntry();
            this.EntryOutput();
            this.CreateBalance();
            this.BalanceOutput();
            newEntry = confirm("Weiterer Eintrag hinzufügen?");
        }
    }
};

haushaltsbuch.AddEntry();
console.log(haushaltsbuch)