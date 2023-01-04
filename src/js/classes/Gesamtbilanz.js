export default class Gesamtbilanz {

    constructor() {
        this._einnahmen = 0;
        this._ausgaben = 0;
        this._bilanz = 0; 
        this._html = this._htmlGenerieren();
    }

    aktualisieren(eintraege) {
        this._einnahmen = 0;
        this._ausgaben = 0;
        this._bilanz = 0;
        eintraege.forEach(eintrag => {
            switch (eintrag.typ()) {
                case "einnahme":
                    this._einnahmen = this._einnahmen + eintrag.betrag();
                    this._bilanz = this._bilanz + eintrag.betrag();
                    break;
                case "ausgabe":
                    this._ausgaben = this._ausgaben + eintrag.betrag();
                    this._bilanz = this._bilanz - eintrag.betrag();
                    break;
                default: 
                    console.log(`Der Typ "${eintrag.typ()}" ist nicht bekannt!`)
                    break;
            }
        });
        this._html = this._htmlGenerieren();
        this.anzeigen();
    }

    _htmlGenerieren() {
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
        einnahmenBetrag.textContent = `${(this._einnahmen / 100).toFixed(2).replace(/\./, ",")} €`;
        einnahmenZeile.insertAdjacentElement("beforeend", einnahmenBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", einnahmenZeile);

        let ausgabenZeile = document.createElement("div");
        ausgabenZeile.setAttribute("class", "gesamtbilanz-zeile ausgaben")
        let ausgabenTitel = document.createElement("span");
        ausgabenTitel.textContent = "Ausgaben:";
        ausgabenZeile.insertAdjacentElement("afterbegin", ausgabenTitel);
        let ausgabenBetrag = document.createElement("span");
        ausgabenBetrag.textContent = `${(this._ausgaben / 100).toFixed(2).replace(/\./, ",")} €`;
        ausgabenZeile.insertAdjacentElement("beforeend", ausgabenBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", ausgabenZeile);

        let bilanzZeile = document.createElement("div");
        bilanzZeile.setAttribute("class", "gesamtbilanz-zeile bilanz")
        let bilanzTitel = document.createElement("span");
        bilanzTitel.textContent = "Bilanz:";
        bilanzZeile.insertAdjacentElement("afterbegin", bilanzTitel);
        let bilanzBetrag = document.createElement("span");
        this._bilanz >= 0 ?  bilanzBetrag.setAttribute("class", "positiv") : bilanzBetrag.setAttribute("class", "negativ");
        bilanzBetrag.textContent = `${(this._bilanz / 100).toFixed(2).replace(/\./, ",")} €`;
        bilanzZeile.insertAdjacentElement("beforeend", bilanzBetrag);
        gesamtbilanz.insertAdjacentElement("beforeend", bilanzZeile);

        return gesamtbilanz;
    }

    _entfernen() {
        let gesamtbilanz = document.querySelector("#gesamtbilanz");
        if (gesamtbilanz !== null) {
            gesamtbilanz.remove();
        }
    }

    anzeigen() {
        this._entfernen();
        document.querySelector("body").insertAdjacentElement("beforeend", this._html);
    }

}