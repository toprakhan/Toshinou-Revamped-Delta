class Hero extends Movable {
	constructor(x, y, factionId, id, mapId) {
		super(x, y);
		this.factionId = factionId;
		this.targetShip = null;
		this.id = id;
		this.mapId = mapId;
		this.cargoIsFull = false;
		this.xEnd = 0;
		this.yEnd = 0;
	}

	move(pos) {
		if (pos instanceof Vector2D) {
			Injector.injectScript('document.getElementById("preloader").moveShip(' + pos.x + ',' + pos.y + ');');
			this.xEnd = pos.x;
			this.yEnd = pos.y;
		}
	}
	
	mapName() {
		switch (this.mapId) {
			case 1:
				return "1-1";
			case 2:
				return "1-2";
			case 3:
				return "1-3";
			case 4:
				return "1-4";
			case 5:
				return "2-1";
			case 6:
				return "2-2";
			case 7:
				return "2-3";
			case 8:
				return "2-4";
			case 9:
				return "3-1";
			case 10:
				return "3-2";
			case 11:
				return "3-3";
			case 12:
				return "3-4";
			case 13:
				return "4-1";
			case 14:
				return "4-2";
			case 15:
				return "4-3";
			case 16:
				return "4-4";
			case 17:
				return "1-5";
			case 18:
				return "1-6";
			case 19:
				return "1-7";
			case 20:
				return "1-8";
			case 21:
				return "2-5";
			case 22:
				return "2-6";
			case 23:
				return "2-7";
			case 24:
				return "2-8";
			case 29:
				return "4-5";
			case 51:
				return "GG α";
			case 55:
				return "GG δ";
			case 73:
				return "GG ζ";
			case 74:
				return "GG κ";
			case 91:
				return "5-1";
			case 92:
				return "5-2";
			case 93:
				return "5-3";
			case 306:
				return "1-BL";
			default:
				return this.mapId;
		}
	}
}