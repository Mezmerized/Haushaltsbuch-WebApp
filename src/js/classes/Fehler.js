export default class Fehler {


    constructor(fehlertext, formularFehler) {
        this._fehlertext = fehlertext;
        this._formularFehler = formularFehler;
        this._html = this._htmlGenerieren();
    }

    _htmlGenerieren() {
        let fehlerbox = document.createElement("div");
        fehlerbox.setAttribute("class", "fehlerbox");

        let fehlertext = document.createElement("span");
        fehlertext.textContent = this._fehlertext;
        fehlerbox.insertAdjacentElement("afterbegin", fehlertext);

        let fehlerliste = document.createElement("ul");
        this._formularFehler.forEach(fehler => {
            let fehlerlistenpunkt = document.createElement("li");
            fehlerlistenpunkt.textContent = fehler;
            fehlerliste.insertAdjacentElement("beforeend", fehlerlistenpunkt);
        });

        fehlerbox.insertAdjacentElement("beforeend", fehlerliste);

        return fehlerbox;
    }

    entfernen() {
        let bestehendeFehlerbox = document.querySelector(".fehlerbox");
        if (bestehendeFehlerbox !== null) {
            bestehendeFehlerbox.remove();
        }
    }

    anzeigen() {
        this.entfernen();
        let eingabeformularContainer = document.querySelector("#eingabeformular-container");
        if (eingabeformularContainer !== null) {
            eingabeformularContainer.insertAdjacentElement("afterbegin", this._html);
        }
    }


}