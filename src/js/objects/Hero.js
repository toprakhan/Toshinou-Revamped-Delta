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
		this.lastAction = "Bot paused";
	}

	move(pos) {
		if (pos instanceof Vector2D) {
			Injector.injectScript('document.getElementById("preloader").moveShip(' + pos.x + ',' + pos.y + ');');
			this.xEnd = pos.x;
			this.yEnd = pos.y;
		}
	}
}