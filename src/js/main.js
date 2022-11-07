"use strict";

const haushaltsbuch = {

    overallBalance: {
        income: 0,
        expense: 0,
        balance: 0
    },

    entries: [

    ],

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

    /* EntryOutput() {
        console.log(`Titel: ${this.newEntry.title}
Typ: ${this.newEntry.type}
Betrag: ${this.newEntry.value} ct
Datum: ${this.newEntry.date}`);
    },

    CalcEntryBalance() {

        switch (this.newEntry.type) {
            case "Einnahme":
                this.overallBalance.income += this.newEntry.value;
                this.overallBalance.balance += this.newEntry.value;
                break;
            case "Ausgabe":
                this.overallBalance.expense += this.newEntry.value;
                this.overallBalance.balance -= this.newEntry.value;
                break;
            default: 
                console.log(`Der Typ "${this.newEntry.type}" ist nicht bekannt!`)
                break;
        }
    },

    BalanceOutput() {
        console.log(`Einnahme: ${this.overallBalance.income} ct
Ausgabe: ${this.overallBalance.expense} ct
Bilanz: ${this.overallBalance.balance} ct
Bilanz ist positiv ${this.overallBalance.balance >= 0}`);
    }, */

    AddEntry() {
        this.GetEntry();
/*         this.EntryOutput();
        this.CalcEntryBalance();
        this.BalanceOutput(); */
    }
};

haushaltsbuch.AddEntry();
console.log(haushaltsbuch)
/* haushaltsbuch.AddEntry();
haushaltsbuch.AddEntry(); */