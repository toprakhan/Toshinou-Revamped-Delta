/*
 * Created by Tanoshizo https://github.com/Alph4rd/Toshinou-Ultra/blob/master/src/js/handlers/commands/HeroPetUpdateHandler.js
 * Gets called when pet is started, pet destroys a target, pet recieves damage
 * jumping a gate, and ocasionally updates from time to time.
*/

class HeroPetUpdateHandler {
	static get ID() {
		return 14129;
	}

	constructor() {
		this._handler = function (e, a) {
			var parsedJson = JSON.parse(e.detail);
			if (a.pet == null) {
				a.pet = new Pet(parsedJson[Variables.heroPetId]);
			} else {
				a.pet.activated = true;
				a.petHasFuel = true;
			}
		}
	}
  
	get handler() {
		return this._handler;
	}
  }