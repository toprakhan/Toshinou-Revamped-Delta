class Settings {
	constructor() {
		this._npcs = new Array();
	}

	get npcs() {
		return this._npcs;
	}

	set npcs(value) {
		this._npcs = value;
	}

	setNpc(name,val) {
		if (this._npcs.hasOwnProperty(name)){
			this._npcs[name]["priority"] = val;
		} else {
			var npcdata = {"name": name, "range": this.npcCircleRadius, "ammo": "1", "priority": val};
			this._npcs[name] = npcdata;
		}
	}

	updateNpc(name, val) {
		this._npcs[name] = val;
	}

	getNpc(name) {
		if (this._npcs.hasOwnProperty(name)){
			return this._npcs[name];
		} else {
			var npcdata = {"name": name, "range": this.npcCircleRadius, "ammo": "0", "priority": "1"};
			return npcdata;
		}
	}

}