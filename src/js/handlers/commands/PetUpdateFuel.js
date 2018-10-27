/*
 * Created by Tanoshizo https://github.com/Alph4rd/Toshinou-Ultra/
*/
class PetUpdateFuel {
	static get ID() {
		return 17699;
	}

	constructor() {
		this._handler = (e, a) => {
            let command = e.wholeMessage.split("|");
            if (a.pet != null) {
            	a.pet.hasFuel = true;
            }
        }
    }

    get handler() {
        return this._handler;
    }

}